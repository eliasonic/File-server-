const bcrypt = require('bcrypt');    // for hashing password
const uuid = require('uuid');       // for generating token
const User = require('../models/user');
const Token = require('../models/token');
const config = require('config')


exports.get = function (req, res) {
    res.redirect('/login');     // redirect to login from root URL
}

exports.register = function (req, res) {
    res.render('register');
}

exports.create = async function (req, res) {
    try {
        const { name, email, password } = req.body;

        // get user info
        const query = await User.getByEmail(email);

        // check if user exists 
        if (query.rowCount > 0) {
            const link = '/login';
            res.send(`<p>You are already registered. Click <a href="${link}">here</a> to log in to your account.</p>`);
        
        } else {           
            // hash password
            const saltRounds = 10;  
            const hash = await bcrypt.hash(password, saltRounds);

            // create new user 
            const result = await User.create(name, email, hash);
            const userId = result.rows[0].id; 

            // generate token for user
            const token = uuid.v4();

            // set token expiry 
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 48);

            // save token info 
            await Token.save(userId, token, tokenExpiry); 
            
            // create verification link 
            const link = `${config.get('url')}/verify?token=${token}`;  

            // get transporter from app object 
            const transporter = req.app.get('transporter');  

            const message = {
                from: 'ea.main.app@gmail.com',
                to: email,
                subject: 'Verify your Email',
                text: `Please click on the link to verify your email: ${link}`
            };

            // Send email
            const info = await transporter.sendMail(message);        
            console.log('Email sent: ' + info.response);
    
            res.send("Account created successfully! Check your inbox or spam to verify your email.");
        }
    } catch (err) {
        console.log(err);
    }
}

exports.verify = async function (req, res) {
    try {
        const token = req.query.token;

        // get token info
        const result = await Token.get(token); 

        const { user_id, expires_at } = result.rows[0];

        // verify token
        if (result.rowCount === 0 || expires_at < new Date()) {  
            res.send('The verification link is invalid or expired');
        
        } else {
            // activate user account
            await User.activate(user_id);

            // delete token info
            await Token.delete(token);
 
            const link = '/login';
            res.send(`<p>Your email has been verified! Click <a href="${link}">here</a> to log in.</p>`);
        }        
    } catch (err) {
        console.log(err);
    }
}

exports.login = function (req, res) {
    res.render('login');
}

exports.home = async function (req, res) {
    try {
        const { email, password } = req.query;

        // get user info
        const result = await User.getByEmail(email);

        // check if user exists
        if (result.rowCount === 0) {
            const link = '/register';
            res.send(`<p>You dont have an account yet! Click <a href="${link}">here</a> to create one.</p>`);        
        
        } else {
            // compare password 
            const hashPassword = result.rows[0].password;
            const outcome = await bcrypt.compare(password, hashPassword);

            // login user
            if (email !== 'ea.main.app@gmail.com') {

                // check if account is activated
                const { is_active } = result.rows[0];
                if (is_active === true) {

                    // check if password is correct 
                    if (outcome == true) {   
                        const { name } = result.rows[0];
                        let firstName = name.split(' ')[0];
                        res.render('home', { firstName: firstName });
                                                                    
                    } else {                       
                        res.send('Password is incorrect!');
                    }

                } else {
                    res.send('Your fileShare account is not activated!');               
                }
        
            // login admin
            } else {
                outcome == true ? res.render('admin') : res.send('Password is incorrect!');
            }  
        }        
    } catch (err) {
        console.log(err);
    }
}
