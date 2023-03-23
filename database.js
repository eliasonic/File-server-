const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'rootUser',
    database: 'fileserver'
});

client.on('connect', () => console.log('Database connected!'));

client.on('end', () => console.log('Database connection ended!'));


module.exports = client;