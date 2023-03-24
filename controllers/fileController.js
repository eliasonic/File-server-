const mime = require('mime');      // for mimetype of file
const path = require('path');
const fs = require('fs');
const File = require('../models/file');


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
            if (req.files) {
                console.log(req.files);
                let file = req.files.file;

                // move file to upload folder
                await file.mv(`./uploads/${file.name}`);

                // add file to files table
                const { description } = req.body;
                await File.upload(file.name, description);

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
            const filePath = `./uploads/${filename}`;
            if (fs.existsSync(filePath)) {
                res.download(filePath);            
            } else {
                res.status(404).send('File not found');
            }
            
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
            
            // get transporter from app object 
            const transporter = req.app.get('transporter');  
            
            // read file data
            fs.readFile(`./uploads/${filename}`, async (err, data) => {
                if (!err) {  

                    const message = {
                        from: 'ea.main.app@gmail.com',
                        to: recipientEmail,
                        subject: 'File Request',
                        text: 'Attached is your requested file.',
                        attachments: [{
                            filename: filename,
                            content: data,
                            contentType: mime.getType(filename)
                        }]
                    }
                    
                    // send email
                    const info = await transporter.sendMail(message);
                    console.log('Email sent: ' + info.response);
                    res.json({message: 'File sent!'});
                }               
            });   
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
