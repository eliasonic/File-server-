//const config = require('config');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    db: {
        host: process.env.POSTGRES_HOST, 
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        ssl: {
            rejectUnauthorized: false
        }
    },

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },

    bucket_config: {
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        },
        region: process.env.REGION
    },

    bucket_name: process.env.BUCKET_NAME,

    url: process.env.APP_URL
}
