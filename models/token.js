const client = require('../database');


exports.save = (userId, token, tokenExpiry) => {
    return client.query(`INSERT INTO tokens(user_id, token, expires_at) VALUES($1, $2, $3)`, [userId, token, tokenExpiry]);
}

exports.get = (token) => {
    return client.query(`SELECT * FROM tokens WHERE token = $1`, [token]);
}

exports.delete = (token) => {
    return client.query(`DELETE FROM tokens WHERE token = $1`, [token]);
}
