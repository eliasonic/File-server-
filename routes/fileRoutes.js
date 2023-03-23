const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');


router.get('/files', fileController.get);

router.post('/upload', fileController.upload);

router.get('/download/:filename', fileController.download);

router.get('/email', fileController.email);

router.get('/search', fileController.search);


module.exports = router;