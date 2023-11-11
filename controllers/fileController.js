const File = require('../models/file');
const { s3 } = require('../utils/multer-upload')
const { GetObjectCommand } = require('@aws-sdk/client-s3')
const config = require('config')

module.exports = {
    get: async (req, res) => {
        try {
            const result = await File.get();
            res.json(result.rows);
        } catch (err) {
            console.log(err);
            res.json({error: 'Error fetching files data'});
        }
    },

    upload: async (req, res) => {
        try {
            if (req.file) {
                console.log(req.file);
                let file = req.file;

                // add file info to files table
                const { description } = req.body;
                await File.upload(file.originalname, description, file.location);

                res.render('admin');
            }            
        } catch (err) {
            console.log(err);
        }
    }, 

    download: async (req, res) => {
        try {
            const {filename} = req.params;
            
            // get download count from database
            const field = 'downloads';
            let result = await File.getCount(field, filename);
            let count = result.rows[0].downloads;

            // update download count in database
            count += 1;
            await File.updateCount(field, count, filename);
            
            // download file
            const input = {
                Bucket: config.get('bucket_name'),
                Key: filename
            }
            const command = new GetObjectCommand(input)
            const response = await s3.send(command)

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            response.Body.pipe(res)
                        
        } catch (err) {
            console.log(err);
        }
    },

    email: async (req, res) => {
        try {
            const { filename } = req.query;
            const recipientEmail = req.query.email;
            
            // get email count from database
            const field = 'emails_sent';
            let result = await File.getCount(field, filename);
            let count = result.rows[0].emails_sent;
            
            // update email count in database
            count += 1;
            await File.updateCount(field, count, filename);

            // get file location
            const response = await File.getLocation(filename)   
            const location = response.rows[0].location           
           
            // send email
            const message = {
                from: 'ea.main.app@gmail.com',
                to: recipientEmail,
                subject: 'File Request',
                text: `Click on the link to download the file: ${location}`,
            }
            
            const transporter = req.app.get('transporter');
            const info = await transporter.sendMail(message);
            console.log('Email sent: ' + info.response);
            res.json({message: 'File sent!'});
                  
        } catch (err) {
            console.log(err);
        }
    },

    search: async (req, res) => {
        try {
            const { search } = req.query;
            const result = await File.search(search);
            console.log(result.rows);
            res.json(result.rows);
        } 
        catch (err) {
            console.log(err);
        }
    }
}
