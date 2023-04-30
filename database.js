const {Client} = require('pg');
const config = require('config');

// create database client
const client = new Client(config.get('db'));

client.on('connect', async () => {
    try {
        console.log('Database connected!')
    
        //create files table
        await client.query(
            `CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                filename TEXT NOT NULL,
                description TEXT NOT NULL,
                downloads INTEGER NOT NULL DEFAULT 0,
                emails_sent INTEGER NOT NULL DEFAULT 0
            )`
        );

        // create users table
        await client.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL, 
                email TEXT NOT NULL UNIQUE, 
                password TEXT NOT NULL, 
                is_active BOOLEAN NOT NULL DEFAULT false
            )`
        );
    
        // create tokens table
        await client.query(
            `CREATE TABLE IF NOT EXISTS tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id), 
                token TEXT NOT NULL, 
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL
            )`
        );
    } catch (err) {
        console.log(err);
    }
    
});

client.on('end', () => console.log('Database connection ended!'));


module.exports = client;