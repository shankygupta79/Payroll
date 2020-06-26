var express = require('express');
var router = express.Router();
var multer  = require('multer');
const path=require('path')
const User = require('./db').User
const cloudinary = require('cloudinary');
const dotenv = require("dotenv")
dotenv.config()
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret:process.env.api_secret
});
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
    //DATE to make it Unique
  }
})

const fileFilter=(req, file, cb)=>{
 if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
     cb(null,true);
 }else{
     cb(null, false);
 }

}
var upload = multer({ 
    storage:storage,
    limits:{
        files: 1,
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
 });

var link='';

const my = (req,res,next)=>{
  next()
}

router.post("/fileupload",my,upload.single('image'),function(req,res,next){

  const filename=req.file.filename;

cloudinary.v2.uploader.upload(req.file.path, 
        function(error, result) {console.log(result.secure_url, error)
        link=result.secure_url;
        link=link.replace("http", "https");
        User.update({   
          thumbnail:link,
        },{where:{emailId:req.body.mail}})
        .then((user) => {
          return res.redirect('/profile');
        })
        .catch((err) => {
          console.log(err)
          res.status(500).send({
              error: "Could not upload the image ! Sorry ."
          })
        })
      })
      .catch((err)=>{
        console.log(err)
        return res.send({Message:err})
      });
});
 
 
module.exports=router;