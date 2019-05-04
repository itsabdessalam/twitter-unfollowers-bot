# 🤖 Twitter unfollowers bot

> A Node.js bot that sends emails to notifies you about twitter unfollowers.

## Installation

You need to create a [Twitter app]([docs/CONTRIBUTING.md](https://developer.twitter.com/en/apps)) to use the API.

### Requirements

This  project should be working as expected with the following minimal version of:

| Dependency |   Version   |
| ---------- | :---------: |
| node       | >= v10.15.0 |
| npm        |  >= v6.8.0  |
| nodemailer |  >= v6.1.1  |
| twit       | >= v2.2.11  |

### Getting started

```bash
# cloning git repository into `my-webpack-starter` folder
git clone https://github.com/Abdessalam98/twitter-unfollowers-bot my-twitter-unfollowers-bot

# install project dependencies
cd my-webpack-starter && my-twitter-unfollowers-bot

# run the project on your server
npm run start
```

### Settings

```javascript
config = {
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
        sg_mail_Config: {
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
}
```

## Author

[Abdessalam Benharira](https://github.com/Abdessalam98)
