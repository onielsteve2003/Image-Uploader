const express = require('express');
// It allows us to upload images
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage Engine(Multer)
const storage = multer.diskStorage({
    destination: './public/uploads/', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Initialize upload Variable
const upload = multer({
    storage: storage,
    // Image Limit
    limits:{fileSize: 1000000},
    // For limiting any type of upload if not an image
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('myImage')

// Check File Type
function checkFileType (file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|jfif/;
    // Check extensions
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    // Check Mime Type
    const mimetype = filetypes.test(file.mimetype)
    // Check if extname and mimetype are true
    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!')
    }
}

// Init App
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public folder
app.use(express.static('./public'));


// Get the Images uploaded
app.get('/', (req, res) => res.render('index'));

// We are using a post because in the form, We passed in a method of post so that we can catch the data and pass it in here
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
            if(err){
                res.render('index', {
                    msg: err
                })
            } else {
               if(req.file === undefined){
                   res.render('index', {
                       msg: 'Error: No File Selected'
                   });
               } else {
                   res.render('index', {
                       msg: 'File Uploaded',
                       file:    `uploads/${req.file.filename}` 
                   })
               }
            }
        })
    })

const port = 5000;

app.listen(port, () => console.log(`server started on port ${port}`));