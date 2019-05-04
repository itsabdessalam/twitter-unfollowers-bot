if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

module.exports = {
	twitter: {
		app: {
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
			access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		},
		user_id: process.env.TWITTER_USER_ID,
		screen_name: process.env.TWITTER_SCREEN_NAME
	},
	mailer: {
		default_mail_config: {
			host: process.env.MAILER_HOST,
			port: process.env.MAILER_PORT,
			secure: process.env.MAILER_SECURE,
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_USER_PASS
			}
		},
		sg_mail_config: {
			auth: {
				api_user: process.env.SENDGRID_USERNAME,
				api_key: process.env.SENDGRID_PASSWORD
			}
		}
	},
	mail_sender: process.env.MAIL_SENDER,
	mail_receiver: process.env.MAIL_RECEIVER,
	website_url: process.env.WEBSITE_URL,
	interval_time: 15 // in minutes
};
