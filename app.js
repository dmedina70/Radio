const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

const fs = require('fs');
const path = require('path');
const multer = require('multer');


const option = ['auspiciadores', 'programas']

const imageFolderPath = 'public/auspiciadores'; // Specify the folder path where the images are stored
const imageFolderPath2 = 'public/programas';
const imageExtensions = ['.jpg', '.jpeg', '.png']; // Specify the allowed image extensions

// Now you have an array `imgFiles` containing all the image filenames in the folder

// Modify your code to use the `imgFiles` array instead of the `img_source` array

let folder ;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destination = `./public/${folder}`;
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const originalFileName = file.originalname;
      cb(null, originalFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Max file size: 5MB
  },
}).single('image');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/admin", function(req,res){
  res.render("admin")
})

app.get("/",function(req,res){
  const imgFiles = fs.readdirSync(imageFolderPath)
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
    const imgFiles2 = fs.readdirSync(imageFolderPath2)
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
  res.render("radio",{imgFiles,imgFiles2})

})

app.get("/admin/:folder",function(req,res){
   const option_folder = req.params.folder;
   option.forEach(element => {
     if (element == option_folder && element == "auspiciadores") {
       const imgFiles = fs.readdirSync(imageFolderPath)
         .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
        folder = element
       res.render("images_manager", {folder:element,imgFiles:imgFiles});
     }
     else if (element == option_folder && element == "programas"){
         const imgFiles2 = fs.readdirSync(imageFolderPath2)
           .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
        folder = element
       res.render("images_manager", {folder:element,imgFiles:imgFiles2 });
     }
   });

});

app.post('/admin/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // Handle the error appropriately
      console.error(err);
      res.send('An error occurred while uploading the image.');
    } else {
      // Redirect to the admin panel after successful upload
      res.redirect('/admin/'+folder);
    }
  });
});

app.post('/admin/delete', (req, res) => {
  const filename = req.body.filename;
  const imagePath = `./public/${folder}/${filename}`;

  // Logic to delete the image file
  fs.unlinkSync(imagePath);

  res.redirect('/admin/'+folder);
});


app.get("/radio",function(req,res){
  res.render("radio",{imgFiles,imgFiles2})
})

app.get("/contact",function(req,res){
  res.render("contact")
})

app.get("/about",function(req,res){
  res.render("about")
})

app.get("/tv",function(req,res){
  res.render("tv")
  var txt = document.querySelector("#body > p").textContent
})


app.listen(process.env.PORT || 3000 , function() {
  console.log("Server started on port 3000");
});
