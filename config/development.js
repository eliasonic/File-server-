const config = require('config');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    db: {
        host: 'localhost', 
        port: 5432,
        user: 'postgres',
        password: 'rootUser',
        database: 'fileserver'
    },

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}
