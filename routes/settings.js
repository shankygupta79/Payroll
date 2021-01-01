const route = require('express').Router()
const path = require('path')
const User = require('../database').User
const Setting = require('../database').Setting
const Sequelize = require('sequelize')
var crypto = require('crypto');
const multer = require('multer');
const sizeOf = require('image-size');
const AWS = require('aws-sdk');
var CryptoJS = require("crypto-js");
const multerS3 = require('multer-s3');
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
var xid = 0;
var salt = '';
var password = '';
var photu = '';
var photu2 = '';
var alreadylogo = '';
var logo2 = '';
var logo = '';
var currency = '';
var office = '';

const authCheck = (req, res, next) => {
  if (req.query.platform == 'APP') {
    console.log(CryptoJS.AES.decrypt(req.query.admin + "", process.env.appkey).toString(CryptoJS.enc.Utf8))
    if (CryptoJS.AES.decrypt(req.query.admin + "", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      xid = CryptoJS.AES.decrypt(req.query.id2 + "", process.env.appkey).toString(CryptoJS.enc.Utf8)
    } else {
      xid = CryptoJS.AES.decrypt(req.query.id + "", process.env.appkey).toString(CryptoJS.enc.Utf8)
      console.log(xid)
    }
    next()
  } else {
    if (isEmpty(req.user)) {
      //user is not logged in
      res.redirect('/login')
    } else {
      if (req.user[0].admin == '0') {
        res.redirect('../users/lock')
      }
      xid = req.user[0].id
      salt = req.user[0].salt
      password = req.user[0].password
      office = req.user[0].office_close
      currency = req.user[0].currency
      alreadylogo = req.user[0].logo
      photu = req.user[0].thumbnail
      console.log(xid)
      next()
    }
  }
}

route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/profile.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})
route.get('/profile', authCheck, (req, res) => {

  res.sendFile(path.join(__dirname, '../views/profile.html'))

})
route.get('/change_password', authCheck, (req, res) => {

  res.sendFile(path.join(__dirname, '../views/change_password.html'))

})
route.get('/configrations', authCheck, (req, res) => {

  res.sendFile(path.join(__dirname, '../views/configrations.html'))

})
route.post('/changepass', authCheck, (req, res) => {
  console.log(" IN Changepass")
  if (req.query.platform == 'APP') {
    User.findOne({ where: { userId: xid } })
      .then((currentUser) => {
        if (currentUser.salt == 'null') {
          return res.send({ message: 'Error ! Only Local users can change the password !' })
        }
        var hash = crypto.pbkdf2Sync(req.body.password, currentUser.salt, 1000, 64, `sha512`).toString(`hex`);
        if (hash != password) {
          return res.send({ message: 'Error ! You entered wrong password !' })
        }
        var newsalt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.pbkdf2Sync(req.body.newpass, newsalt, 1000, 64, `sha512`).toString(`hex`);
        User.update({
          salt: newsalt,
          password: hash,
        }, { where: { id: xid } }).then((user) => {
          console.log("Password changed Successfully !")
          var abc = CryptoJS.AES.encrypt(currentUser.password + "", process.env.appkey).toString();
          return res.send({ message: 'true', id: abc })

        }).catch((err) => {
          console.log(err)
          return res.send({
            message: "Could not retrive data"
          })
        })
      })
      .catch((err) => {
        console.log(err)
          return res.send({
            message: "Could not retrive data"
          })
      })

  } else {
    if (salt == 'null') {
      return res.send({ message: 'Error ! Only Local users can change the password !' })
    }
    var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`);
    if (hash != password) {
      return res.send({ message: 'Error ! You entered wrong password !' })
    }
    var newsalt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(req.body.newpass, newsalt, 1000, 64, `sha512`).toString(`hex`);
    User.update({
      salt: newsalt,
      password: hash,
    }, { where: { id: xid } }).then((user) => {
      console.log("Password changed Successfully !")
      return res.send({ message: 'true' })

    }).catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not retrive holidays"
      })
    })
  }

})
route.get('/api/setting', authCheck, (req, res) => {
  Setting.findOne({ where: { userId: xid } })
    .then((emps) => {
      res.status(200).send([emps, currency, alreadylogo, office, photu])
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not retrive settings info "
      })
    })


})
route.get('/api/symbol', authCheck, (req, res) => {
  Setting.findOne({ where: { userId: xid } })
    .then((emps) => {
      res.status(200).send(currency)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        message: " Currecy symbol error"
      })
    })


})

route.post('/editpr', authCheck, (req, res) => {
  console.log(photu + " IN EDIT")
  if (photu2 == '') {
    photu2 = req.body.photo
  }
  User.update({
    thumbnail: photu2
  }, { where: { id: xid } }).then((user1) => {


    console.log("Profile image and theme Successfully !")
    photu = "";
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Could not update your profile image !"
    })
  })
})
route.post('/edit', authCheck, (req, res) => {
  console.log(" IN EDIT")
  var regExp = /\(([^)]+)\)/;
  var matches = regExp.exec(req.body.currency);
  console.log("LOogo Change")
  if (logo2 == '') {
    logo2 = req.body.logo
  }
  console.log(logo2)
  User.update({
    currency: matches[1],
    office_close: req.body.office,
    logo: logo2,
  }, {
    where: Sequelize.or(
      { id: xid },
      { userId: xid }
    )
  }).then((user1) => {
    Setting.update({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      add: req.body.address,
      state: req.body.state,
      country: req.body.country,
    }, { where: { userId: xid } }).then((user2) => {
      console.log("Configurations Edited Successfully !")
      return res.send({ message: 'true' })

    }).catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not update configurations"
      })
    })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Could not update configurations"
    })
  })
})
route.post('/uploadpr', upload.single('file'), (req, res) => {
  console.log("Thumbnail Chnage")
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    });
  }
  photu2 = req.file.location;
  console.log(photu2)
  return res.send({ message: "Done" })




});
route.post('/uploadlg', upload.single('file'), (req, res) => {

  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    });
  }
  logo2 = req.file.location;
  console.log(logo2)
  return res.send({ message: "Done" })

});
module.exports = route