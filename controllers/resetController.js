const bcrypt = require('bcrypt');    
const uuid = require('uuid');       

const User = require('../models/user');
const Token = require('../models/token');


exports.forgot = (req, res) => {
    res.render('forgot');
}

exports.sendLink = async (req, res) => {
    try {
        const { email } = req.body;

        // get user info
        const result = await User.getByEmail(email);
        const userId = result.rows[0].id;

        // generate token for user
        const token = uuid.v4();

        // set token expiry 
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 48); 

        // save token info
        const table = 'password_reset';
        await Token.save(table, userId, token, tokenExpiry); 

        // create reset link 
        const link = `http://localhost:3000/reset-password?token=${token}`;

        // get transporter from app object 
        const transporter = req.app.get('transporter');  

        const message = {
            from: 'ea.main.app@gmail.com',
            to: email,
            subject: 'Reset your Password',
            text: `Please click on the link to reset your password: ${link}`
        };

        // Send email
        const info = await transporter.sendMail(message);        
        console.log('Email sent: ' + info.response);
    
        res.send(`A password-reset link has been sent to ${email}`);
    } catch (err) {
        console.log(err);
    }
}

exports.verifyLink = async (req, res) => {
    try {
        const token = req.query.token;

        // get token info
        const table = 'password_reset';
        const result = await Token.get(table, token); 

        // verify token
        const { expires_at } = result.rows[0];

        if (result.rowCount === 0 || expires_at < new Date()) {
            res.send('The reset link is invalid or expired');

        } else {
            // render reset page
            res.render('reset', { token: token });
        }
    } catch (err) {
        console.log(err);
    }
}

exports.reset = async (req, res) => {
    try {
        const newPassword = req.body.password;
        const token = req.body.token;

        // get token info
        const table = 'password_reset';
        const result = await Token.get(table, token);

        // hash password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(newPassword, saltRounds);

        // update user password 
        const userId = result.rows[0].user_id;
        await User.reset(hashPassword, userId);
        
        // delete token info
        await Token.delete(table, token);
 
        const link = 'http://localhost:3000/login';
        res.send(`<p>Password reset successful! Click <a href="${link}">here</a> to log in.</p>`);

    } catch (err) {
        console.log(err);
    }
}