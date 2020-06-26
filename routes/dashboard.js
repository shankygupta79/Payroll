const route = require('express').Router()
const Emp = require('../database').Employeeqdb
const Dep = require('../database').Department
const Att = require('../database').Attendance
const Sequelize = require('sequelize')
const path = require('path')
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var xid = 0
var alreadylogo='';
var arr=['01-','02-','03-','04-','05-','06-','07-','08-','09-','10-','11-','12-']
const authCheck = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      xid = req.user[0].userId

    } else {
      xid = req.user[0].id
    }
   
    alreadylogo=req.user[0].logo
    next()
  }
}
route.get('/logo', authCheck, (req, res) => {
  res.status(200).send(alreadylogo)
})
route.get('/api', authCheck, (req, res) => {
  res.status(200).send(req.user[0]);
})
route.get('/', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/dashboard.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})
route.get('/api/dash', authCheck, (req, res) => {
  var total = 0;
  var dep = 0;
  var today0 = new Date().getTime()+60*60*1000*5.5;
  var a = new Date(today0);
  var z=a.getDate()+"P"
  console.log(today0)
  console.log(a)
  console.log(z)
  Emp.count({
    where: { userId: xid ,status:'Active'}
  }).then((emps) => {
    Dep.count({
      where: { userId: xid }
    }).then((deps) => {
      Att.count({
        where: { userId: xid ,monthyear:arr[a.getMonth()]+a.getFullYear() , quick:z}
      }).then((att) => {
        res.status(200).send([emps,deps,att,emps-att])
      }).catch((err) => {
        console.log(err)
        res.send({
          message: "Could not retrive info "
        })
      })
    }).catch((err) => {
      console.log(err)
      res.send({
        message: "Could not retrive info "
      })
    })
  }).catch((err) => {
    console.log(err)
    res.send({
      message: "Could not retrive info "
    })
  })
})


module.exports = route