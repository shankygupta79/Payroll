const route = require('express').Router()
const path = require('path')
var photo = ''
const User = require('../database').User
const multer = require('multer');
const sizeOf = require('image-size');
var crypto = require('crypto');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
var photu = ''
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
var logo = '';
var office = ''
var xid = 0;
var curren = '';


const authCheck = (req, res, next) => {
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
const authCheck2 = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    xid = req.user[0].id
    next()
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
  },{ where: { id:req.body.id }}).then((user) => {
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
    userId: xid,
    username: req.body.name,
    thumbnail: photu,
    emailId: req.body.mail,
    authenticationType: 'local',
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
  cloudinary.v2.uploader.upload(req.file.path,
    function (error, result) {
      photu = result.secure_url;
      console.log(photu)
      return res.send({ message: "Done" })
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        error: "Could not upload image"
      })
    });
  


});
route.get('/api/user', authCheck, (req, res) => {
  console.log(req.query.id)
  if (req.query.id > 0) {
    User.findOne({ where: { id: req.query.id } })
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
    User.findAll({ where: { userId: xid } })
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