const route = require('express').Router()
const path = require('path')
const User = require('../database').User
const Setting = require('../database').Setting
const Sequelize = require('sequelize')
var crypto = require('crypto');
const multer = require('multer');
const sizeOf = require('image-size');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});


var upload = multer({ dest: 'uploads/' });
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
const authCheck2 = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      xid = req.user[0].userId
    } else {
      xid = req.user[0].id
    }
    alreadylogo = req.user[0].logo

    next()
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
        message: "Could not retrive settings info "
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
  cloudinary.v2.uploader.upload(req.file.path,
    function (error, result) {
      photu2 = result.url;
      console.log(photu2)
      return res.send({ message: "Done" })
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        error: "Could not upload image"
      })
    });



});
route.post('/uploadlg', upload.single('file'), (req, res) => {

  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    });
  }
  cloudinary.v2.uploader.upload(req.file.path,
    function (error, result) {
      logo2 = result.url;
      console.log(logo2)
      return res.send({ message: "Done" })
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        error: "Could not upload image"
      })
    });



});
module.exports = route