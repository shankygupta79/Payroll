const route = require('express').Router()
const path = require('path')
const Sequelize = require('sequelize')
const Department = require('../database').Department
const Employee = require('../database').Employeeqdb

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
    if (CryptoJS.AES.decrypt(req.query.admin + "", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin = 0
      var y = CryptoJS.AES.decrypt(req.query.access + "", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
      if (y[2] == 'false') {
        return res.send(false)
      }
      xid = CryptoJS.AES.decrypt(req.query.id2 + "", process.env.appkey).toString(CryptoJS.enc.Utf8)
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
        xid = req.user[0].userid
        var y = req.user[0].access.split(';')
        if (y[2] == 'false') {

          res.redirect('../users/lock')
        }
      } else {
        xid = req.user[0].id
      }
      console.log(xid)
      next()
    }
  }
}
const authCheckedit = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin + "", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin = 0
      var y = CryptoJS.AES.decrypt(req.query.access + "", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
      if (y[3] == 'false') {
        return res.send(false)
      }
      xid = CryptoJS.AES.decrypt(req.query.id2 + "", process.env.appkey).toString(CryptoJS.enc.Utf8)
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
        xid = req.user[0].userid
        var y = req.user[0].access.split(';')
        if (y[3] == 'false') {
          return res.send({ message: "You dont have access to edit " })
        }
      } else {
        xid = req.user[0].id
      }
      next()
    }
  }
}
route.get('/add_dep', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_dep.html'))
})
route.get('/manage_dep', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_dep.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/dep.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})
route.post('/add_deppost', authCheckedit, (req, res) => {
  console.log("Hey in DEP ADD")
  Department.create({
    userid: xid,
    depname: req.body.name,

  }).then((hol) => {
    console.log("Department Created Successfully !")
    return res.send({ message: 'true' })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.get('/api/dep', authCheckview, (req, res) => {

  Department.findAll({ where: { userid: xid } })
    .then((emps) => {
      res.status(200).send(emps)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not retrive users"
      })
    })

})
route.get('/api/dep2', authCheckview, (req, res) => {

  Employee.findAll({
    where: { userid: xid },
    group: ['dep'],
    attributes: ['dep', [Sequelize.fn('COUNT', 'dep'), 'depcount']],
  })
    .then((emps) => {
      res.status(200).send(emps)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not retrive employees"
      })
    })

})
route.post('/delete', authCheckedit, (req, res) => {
  console.log(req.query.idx + " IN Delete")
  Department.destroy({
    where: {
      depname: req.query.idx
    }
  }).then((dep) => {
    Employee.update({
      dep: 'unknown',
    }, { where: { dep: req.query.idx } }).then((emps) => {
      console.log("Holiday Edited Successfully !")
      return res.send({ message: 'true' })

    }).catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not retrive departments"
      })
    })

  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Could not retrive Departments"
    })
  })
})
module.exports = route