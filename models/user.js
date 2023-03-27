const client = require('../database');


exports.getByEmail = (email) => {
    return client.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

exports.create = (name, email, hash) => {
    return client.query(`INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id`, [name, email, hash]);
}

exports.activate = (user_id) => {
    return client.query(`UPDATE users SET is_active = true WHERE id = $1`, [user_id]);
}

exports.reset = (hashPassword, userId) => {
    return client.query(`UPDATE users SET password = $1 WHERE id = $2`, [hashPassword, userId]);
}

/* delete */
exports.delete = (email) => {
    return client.query(`DELETE FROM users WHERE email = $1 RETURNING *`, [email]);
}
