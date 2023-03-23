const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.get);

router.get('/register', userController.register);

router.post('/register', userController.create);

router.get('/verify', userController.verify);

router.get('/login', userController.login);

router.get('/home', userController.home);


module.exports = router;