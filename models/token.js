const client = require('../database');


exports.save = (table, userId, token, tokenExpiry) => {
    return client.query(`INSERT INTO ${table}(user_id, token, expires_at) VALUES($1, $2, $3)`, [userId, token, tokenExpiry]);
}

exports.get = (table, token) => {
    return client.query(`SELECT * FROM ${table} WHERE token = $1`, [token]);
}

exports.delete = (table, token) => {
    return client.query(`DELETE FROM ${table} WHERE token = $1`, [token]);
}
