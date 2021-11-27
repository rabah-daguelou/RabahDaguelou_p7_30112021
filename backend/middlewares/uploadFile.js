const fs= require('fs');
const multer= require ('multer');
const express= require ('express');

const fileFilter 		= (req, file, cb) => {
    const allowedTypes 	= ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error 		= new Error("Incorrect file");
      error.code 			= "INCORRECT_FILETYPE";
      return cb(error, false)
    }
    cb(null, true);
  }
  
  const upload = multer({
    dest: './uploads',
    fileFilter,
    limits: {
      fileSize: 5000000
    }
  });
  
  app.post('/upload', upload.single('file'), (req, res) => {
      
  
    console.log (req.file.originalname)
  
      fs.readFile(req.file.path, function (err, data) {
          var newPath = __dirname + "/images/"+req.file.originalname;
          fs.writeFile(newPath, data, function (err) {
              res.json(req.file);
      
          });
      });
      
  });