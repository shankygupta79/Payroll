const route = require('express').Router()
const path = require('path')
var photo = ''
const User = require('../database').User
const multer = require('multer');
const sizeOf = require('image-size');
var crypto = require('crypto');
const cloudinary = require('cloudinary');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
var photu = ''
var CryptoJS = require("crypto-js");
AWS.config.update({ accessKeyId: process.env.BKey, secretAccessKey: process.env.BSecret });
const endpoint = new AWS.Endpoint(process.env.BHost);

const s3 = new AWS.S3({ endpoint });
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'payrollbucket2',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
    }
  })
});
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var logo = '';
var office = ''
var xid = 0;
var curren = '';


const authCheck = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin + "", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin = 0
      return res.send(false)

    } else {
      admin = 1
      xid = CryptoJS.AES.decrypt(req.query.id + "", process.env.appkey).toString(CryptoJS.enc.Utf8)
      console.log(xid)
    }
    office = req.query.off
    next()
  } else {
    if (isEmpty(req.user)) {
      //user is not logged in
      res.redirect('/login')
    } else {
      if (req.user[0].admin == '0') {
        res.redirect('./lock')
      }
      xid = req.user[0].id
      curren = req.user[0].currency
      office = req.user[0].office_close
      logo = req.user[0].logo
      console.log(xid)
      next()
    }
  }
}
const authCheck2 = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin + "", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin = 0
      return res.send(false)

    } else {
      admin = 1
      xid = CryptoJS.AES.decrypt(req.query.id + "", process.env.appkey).toString(CryptoJS.enc.Utf8)
      console.log(xid)
    }
    office = req.query.off
    next()
  } else {
    if (isEmpty(req.user)) {
      //user is not logged in
      res.redirect('/login')
    } else {
      xid = req.user[0].id
      next()
    }
  }
}
route.get('/lock', authCheck2, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index2.html'))
})
route.get('/add_user', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_user.html'))
})
route.get('/manage_user', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_user.html'))
})
route.get('/edit_user', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/edit_user.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/user.css'))

})

route.post('/delete', authCheck, (req, res) => {
  console.log("Destroying User")
  User.destroy({
    where: {
      id: req.body.id
    }
  }).then(function (rowDeleted) { //returns Number of row deleted
    if (rowDeleted == 1) {
      return res.send({
        message: "Deleted the user successfully ! "
      })
    }

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.post('/edit_userpost', authCheck, (req, res) => {
  console.log("Hey in Edit")
  User.update({
    username: req.body.name,
    access: req.body.y,
  }, { where: { id: req.body.id } }).then((user) => {
    console.log("User Edited Successfully !")
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.post('/add_userpost', authCheck, (req, res) => {
  console.log("Hey")
  if (photu == '') {
    photu = "https://res.cloudinary.com/shankygupta79/image/upload/v1592562756/profile_iz3s6y.jpg";
  }
  var newsalt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(req.body.password, newsalt, 1000, 64, `sha512`).toString(`hex`);
  User.create({
    userid: xid,
    username: req.body.name,
    fullname: req.body.name,
    thumbnail: photu,
    emailid: req.body.mail,
    authenticationtype: 'local',
    password: hash,
    salt: newsalt,
    valid: 1,
    admin: 0,
    access: req.body.y,
    logo: logo,
    currency: curren,
    office_close: office,
  }).then((user) => {
    photu = '';
    console.log("User Created Successfully !")
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.post('/user/uploadpr', upload.single('file'), (req, res) => {
  console.log("AYA")
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    });
  }
  photu = req.file.location;
  console.log(photu)
  return res.send({ message: "Done" })




});
route.get('/api/user', authCheck, (req, res) => {
  console.log(req.query.idx)
  if (req.query.idx > 0) {
    User.findOne({ where: { id: req.query.idx } })
      .then((emps) => {
        res.status(200).send(emps)
      })
      .catch((err) => {
        console.log(err)
        return res.send({
          message: "Could not retrive users"
        })
      })
  } else {
    User.findAll({ where: { userid: xid } })
      .then((emps) => {
        res.status(200).send(emps)
      })
      .catch((err) => {
        console.log(err)
        return res.send({
          message: "Could not retrive users"
        })
      })
  }


})


module.exports = route