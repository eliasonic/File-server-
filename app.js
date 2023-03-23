const express = require('express');

const bodyParser = require('body-parser'); 
const fileupload = require('express-fileupload');

const ejs = require('ejs');
const path = require('path');

const client = require('./database');
const nodemailer = require('nodemailer');

const fileRoutes = require('');
const userRoutes = require('');
const resetRoutes = require('');


// create Express app
const app = express();

// set data parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set fileupload middleware
app.use(fileupload());

// set middleware for serving static assets/files
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine and directory
app.set('view engine', 'ejs');    
app.set('views', path.join(__dirname, 'views'));  

// connect database client
client.connect();

// create and set transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ea.main.app@gmail.com',
      pass: 'pbqyqchegnnlkcex'
    }
});
app.set('transporter', transporter);

// set the routes
app.use('/', fileRoutes);
app.use('/', userRoutes);
app.use('/', resetRoutes);

// start server
app.listen(3000, () => console.log('Server is started at port 3000...'));