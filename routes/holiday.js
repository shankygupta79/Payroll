const route = require('express').Router()
const Holiday = require('../database').Holiday
const path = require('path')
var CryptoJS = require("crypto-js");
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var xid = 0;
const authCheckview = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin+"", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin=0
      var y = CryptoJS.AES.decrypt(req.query.access+"", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
      if (y[6] == 'false') {
        return res.send(false)
      }
      xid = CryptoJS.AES.decrypt(req.query.id2+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
    } else {
      admin=1
      xid = CryptoJS.AES.decrypt(req.query.id+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
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
      xid = req.user[0].userId
      var y = req.user[0].access.split(';')
      if (y[6] == 'false') {

        res.redirect('../users/lock')
      }
    } else {
      xid = req.user[0].id
    }
    console.log(xid)
    next()
  }}
}
const authCheckedit = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin+"", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin=0
      var y = CryptoJS.AES.decrypt(req.query.access+"", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
      if (y[7] == 'false') {
        return res.send(false)
      }
      xid = CryptoJS.AES.decrypt(req.query.id2+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
    } else {
      admin=1
      xid = CryptoJS.AES.decrypt(req.query.id+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
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
      xid = req.user[0].userId
      var y = req.user[0].access.split(';')
      if (y[7] == 'false') {
        return res.send({ message: "You dont have access to edit " })
      }
    }else{
      xid = req.user[0].id
    }
    next()
  }
}
}
route.get('/add_holiday', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_holiday.html'))
})
route.get('/manage_holiday', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_holiday.html'))
})
route.get('/edit_holiday', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/edit_holiday.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/holiday.css'))

})

route.post('/add_holpost', authCheckedit, (req, res) => {
  console.log("Hey")
  Holiday.create({
    userId: xid,
    name: req.body.name,
    year: req.body.year,
    date: req.body.date,

  }).then((hol) => {
    console.log("Holiday Created Successfully !")
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.get('/api/holiday', authCheckview, (req, res) => {
  console.log(req.query.id)
  if (req.query.id > 0) {
    Holiday.findOne({ where: { hol_id: req.query.id } })
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
    Holiday.findAll({ where: { userId: xid } })
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
route.post('/edit_holpost', authCheckedit, (req, res) => {
  console.log(req.query.id + " IN EDIT")
  Holiday.update({
    holname: req.body.name,
    date: req.body.date,
  }, { where: { hol_id: req.query.id } }).then((user) => {
    console.log("Holiday Edited Successfully !")
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Could not retrive holidays"
    })
  })
})
route.post('/delete', authCheckedit, (req, res) => {
  console.log(req.query.id + " IN Delete")
  Holiday.destroy({
    where: {
      hol_id: req.query.id
    }
  }).then((user) => {
    console.log("Holiday Deleted Successfully !")
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Could not retrive holidays"
    })
  })
})

module.exports = route