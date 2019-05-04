const config = require("./config");
const utils = require("./utils");
const http = require("http");
const Twitter = require("twit");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const mailConfig =
	config.mailer.sg_mail_config !== undefined
		? sgTransport(config.mailer.sg_mail_config)
		: config.mailer.default_mail_config;

// On crée le serveur
const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.write("Hello from Node.js 🤖 twitter bot! ");
	res.end();
});

// On crée le client twitter
const client = new Twitter(config.twitter.app);

// On crée notre transporter permettant l'achemeniment de l'email
// dans notre cas on utilise SendGrid
const transporter = nodemailer.createTransport(mailConfig);

// Le serveur écoute sur un port renseigné en variable d'environnement
// sinon utilise le port 3000
server.listen(process.env.PORT || 3000);
console.log("🚀 Server is running !");

// Liste des followers
let oldFollowersList = [];

/**
 * Récupère la liste des utilisateurs
 * à partir de l'API Twitter
 *
 * @returns
 */
const getFollowersIDs = () => {
	return new Promise((resolve, reject) => {
		client.get(
			"followers/ids",
			{ stringify_ids: true },
			(error, response) => {
				if (error) {
					reject(error);
				}
				resolve(response);
			}
		);
	});
};

/**
 * Récupère les infos d'un utilisateur
 * avec son ID à partir de l'API Twitter
 *
 * @param {*} userID
 * @returns
 */
const getUser = userID => {
	return new Promise((resolve, reject) => {
		client.get(
			"users/show",
			{ user_id: userID, include_entities: false },
			(error, response) => {
				if (error) {
					reject(error);
				}
				resolve({
					id: response.id,
					name: response.name,
					username: response.screen_name
				});
			}
		);
	});
};

/**
 * Envoie un email
 *
 * @param {*} content
 * @returns
 */
const notifyByEmail = content => {
	const email = {
		from: config.mail_sender,
		to: config.mail_receiver,
		subject: "Twitter bot notifications",
		html: `<p>${content}</p>`
	};

	return new Promise((resolve, reject) => {
		transporter.sendMail(email, (error, info) => {
			if (error) {
				reject(error);
			}
			resolve(info);
		});
	});
};

/**
 * Lance le process
 *
 */
const start = () => {
	// On récupère la liste des followers
	// à partir de l'API Twitter
	getFollowersIDs().then(followers => {
		let followersIDs = followers.ids;
		let unfollowers = [];

		return new Promise((resolve, reject) => {
			// On vérifie ce qu'on a
			// avec le résultat de la requête
			let diff = utils.getDiffElements(oldFollowersList, followersIDs);
			if (oldFollowersList.length > 0 && diff.length > 0) {
				// Si on a une différence
				// alors parcourt le tableau de différence
				// et on rajoute l'unfollower au tableau
				for (let index = 0; index < diff.length; index++) {
					const userID = diff[index];
					getUser(userID).then(data => {
						unfollowers.push({
							id: data.id,
							name: data.name,
							username: data.username
						});
						if (diff.length === unfollowers.length) {
							resolve(unfollowers);
						}
					});
				}
			}
			// On update la liste des followers
			oldFollowersList = followersIDs;
		}).then(unfollowers => {
			if (unfollowers && unfollowers.length > 0) {
				let content = "Liste des unfollowers <br>";
				for (let j = 0; j < unfollowers.length; j++) {
					const unfollower = unfollowers[j];
					content += `
                        ${unfollower.name}: ${unfollower.username} <br>
                    `;
				}
				// On envoie l'email
				notifyByEmail(content);
			}
		});
	});
};

setInterval(() => {
	return new Promise((resolve, reject) => {
		// on fait une requête sur notre serveur
		// pour vérifier que celui-ci renvoie bien
		// un statut 200
		// peut servir aussi pour le dyno de heroku
		http.get(config.website_url, response => {
			const { statusCode } = response;
			let error;
			if (statusCode !== 200) {
				error = new Error(
					"Request Failed.\n" + `Status Code: ${statusCode}`
				);
			}
			if (error) {
				reject(error);
				response.resume();
				return;
			}
			resolve(response.statusCode);
		});
	})
		.then(statusCode => {
			if (statusCode && statusCode === 200) {
				start();
			}
		})
		.catch(error => console.log(error));
}, (config.interval_time !== undefined ? config.interval_time : 15) * 60 * 1000);
