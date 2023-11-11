const multer = require('multer')
const multerS3 = require('multer-s3') 
const {S3Client} = require('@aws-sdk/client-s3')
const config = require('config')

const s3 = new S3Client(config.get('bucket_config'))

const upload = multer({
    storage: multerS3({
        bucket: config.get('bucket_name'),
        s3: s3,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
})

module.exports = {
    s3,
    upload
}