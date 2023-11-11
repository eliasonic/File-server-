const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { upload } = require('../utils/multer-upload')


router.get('/files', fileController.get);

router.post('/upload', upload.single('file'), fileController.upload);

router.get('/download/:filename', fileController.download);

router.get('/email', fileController.email);

router.get('/search', fileController.search);


module.exports = router;