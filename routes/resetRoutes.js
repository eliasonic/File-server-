const express = require('express');
const router = express.Router();
const resetController = require('../controllers/resetController');


router.get('/forgot-password', resetController.forgot);

router.post('/forgot-password', resetController.sendLink);

router.get('/reset-password', resetController.verifyLink);

router.post('/reset-password', resetController.reset);


module.exports = router;