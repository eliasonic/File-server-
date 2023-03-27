const {Client} = require('pg');


const client = new Client({
    host: 'dpg-cggh49m4daddcg3vvoa0-a',  //process.env.PGHOST,
    port: 5432, //process.env.PGPORT,
    user: 'file_server_db_user',  //process.env.PGUSER,
    password: '8vYWKI9O9NUd9n1DD7PMNd081njoZ68o',  //process.env.PGPASSWORD,
    database: 'file_server_db'  //process.env.PGDATABASE,
});

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