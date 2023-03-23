const bcrypt = require('bcrypt');    // for hashing password
const uuid = require('uuid');       // for generating token

const User = require('../models/user');
const Token = require('../models/token');


exports.get = function (req, res) {
    res.redirect('http://localhost:3000/login');     // redirect to login from root URL
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
            const link = 'http://localhost:3000/login';
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
            const table = 'account_verification';
            await Token.save(table, userId, token, tokenExpiry); 
            
            // create verification link 
            const link = `http://localhost:3000/verify?token=${token}`;  

            // get transporter from app object 
            const transporter = req.app.get('transporter');  

            const message = {
                from: 'ea.main.app@gmail.com',
                to: email,
                subject: 'Verify your Account',
                text: `Please click on the link to verify your account: ${link}`
            };

            // Send email
            const info = await transporter.sendMail(message);        
            console.log('Email sent: ' + info.response);
    
            res.send('Account created successfully! Check your email to activate the account.');
        }
    } catch (err) {
        console.log(err);
    }
}

exports.verify = async function (req, res) {
    try {
        const token = req.query.token;

        // get token info
        const table = 'account_verification';
        const result = await Token.get(table, token); 

        const { user_id, expires_at } = result.rows[0];

        // verify token
        if (result.rowCount === 0 || expires_at < new Date()) {  
            res.send('The verification link is invalid or expired');
        
        } else {
            // activate user account
            await User.activate(user_id);

            // delete token info
            await Token.delete(table, token);
 
            const link = 'http://localhost:3000/login';
            res.send(`<p>Your account has been activated! Click <a href="${link}">here</a> to log in.</p>`);
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
            const link = 'http://localhost:3000/register';
            res.send(`<p>You dont have an account yet! Click <a href="${link}">here</a> to create one.</p>`);

        } else {
            // check if account is activated
            const { is_active } = result.rows[0];
            if (is_active === true) {

                // check password
                const hashPassword = result.rows[0].password;
                const outcome = await bcrypt.compare(password, hashPassword);

                if (outcome == false) {
                    res.send('Password is incorrect!');
                
                } else if (outcome == true && email === 'ea.main.app@gmail.com') {
                    res.render('admin');
                
                }  else {                       
                    // render home with user firstname    
                    const { name } = result.rows[0];
                    let firstName = name.split(' ')[0];
                    res.render('home', { firstName: firstName });
                }

            } else {
                res.send('Account is not activated!');
            }
        }   
    } catch (err) {
        console.log(err);
    }
}