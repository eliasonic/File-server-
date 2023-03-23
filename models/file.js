const client = require('../database');

class File {
    static get() {
        return client.query(`SELECT * FROM files`);
    }

    static upload(filename, description) {
        return client.query(`INSERT INTO files(filename, description) VALUES($1, $2)`, [filename, description]);
    }

    static getCount(field, filename) {
        return client.query(`SELECT ${field} FROM files WHERE filename = $1`, [filename]);
    }

    static updateCount(field, count, filename) {
        return client.query(`UPDATE files SET ${field} = $1 WHERE filename = $2`, [count, filename]);
    }

    static search(search) {
        return client.query(`SELECT filename, description FROM files WHERE filename LIKE $1`, [`%${search}%`]);
    }
}


module.exports = File;