const route = require('express').Router()
const Emp = require('../database').Employeeqdb
const Att = require('../database').Attendance
const Hol = require('../database').Holiday
const path = require('path')
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var a0 = new Date().getTime() + 60 * 60 * 1000 * 5.5;
var a = new Date(a0);
var xid = 0;
var arr = ['01-', '02-', '03-', '04-', '05-', '06-', '07-', '08-', '09-', '10-', '11-', '12-']
var admin = 1;
var office = '';
var y5 = 'true';
const authCheckmark = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      admin = 0
      xid = req.user[0].userId
      var y = req.user[0].access.split(';')
      y5 = y[5];
      if (y[4] == 'false') {

        res.redirect('../users/lock')
      }
    } else {
      admin = 1
      xid = req.user[0].id
    }
    office = req.user[0].office_close
    console.log(xid)
    next()
  }
}
const authCheckedit = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      admin = 0;
      xid = req.user[0].userId
      var y = req.user[0].access.split(';')
      y5 = y[5];
      if (y[5] == 'false') {
        return res.send({ message: "You dont have access to edit " })
      }
    } else {
      admin = 1
      xid = req.user[0].id
    }
    next()
  }
}
route.get('/daily_attendance', authCheckmark, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/daily_attendance.html'))
})
route.get('/attendance_report', authCheckedit, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/attendance_report.html'))
})
route.get('/css', (req, res) => {
  res.sendFile(path.join(__dirname, '../css/attendance.css'))
})
route.get('/api/holiday', authCheckmark, (req, res) => {
  console.log(req.query.date)
  Hol.findOne({ where: { date: req.query.date, userId: xid } })
    .then((emps) => {
      if (emps != null || office[req.query.day] == '1') {
        res.status(200).send(true)
      } else {
        res.status(200).send(false)
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({
        message: "Could not retrive info "
      })
    })
})
function create(data, x2) {
  return Att.create({
    userId: xid,
    emp_id: data.emp_id,
    monthyear: x2,
    present: "-------------------------------",
    marked: "0000000000000000000000000000000",
    quick: "",
    holidays: 0,
    extratimetotoal: 0,
    extratime: "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0",
    advance: 0,
    bonus: 0,
    deduction: 0,
    balance: 0,
    transfer: 0,
    attby: "0000000000000000000000000000000",
    text: "No Comments",
    netpay: 0,
    emi:0,
  }).then((att) => {
    console.log("Chart created new")
    return true
  })
    .catch((err) => {
      console.log(err)
      return false
    })
}
route.get('/api/attendance', authCheckmark, (req, res) => {
  if (y5 == 'false' && req.query.dx != a.getDate() && admin==0) {
    return res.status(201).send('0')
  }
  Emp.hasMany(Att, { foreignKey: 'emp_id' })
  Att.belongsTo(Emp, { foreignKey: 'emp_id' })

  Att.findAll({ where: { monthyear: req.query.date, userId: xid }, include: [Emp] })
    .then((emps) => {
      if (emps[0]) {
        return res.status(200).send(emps)
        next()

      } else {
        Emp.findAll({ where: { userId: xid, status: 'Active' } })
          .then(async (emps) => {
            for (var i = 0; i < emps.length; i++) {
              var x = await create(emps[i], req.query.date)
              
            }
            
          })
          .catch((err) => {
            console.log(err)
            res.send({
              message: "Could not retrive info "
            })
          })
          return res.status(200).send('5');

      }
    })
    .catch((err) => {
      console.log(err)
      res.send({
        message: "Could not retrive settings info "
      })
    })


})
route.post('/edit', authCheckmark, (req, res) => {
  console.log(" IN EDIT")
  console.log(req.body.monthyear)
  var tp = req.body.attby
  tp = tp.substring(0, req.body.dx - 1) + admin + tp.substring(req.body.dx);
  if (req.body.quick == '') {
    Att.update({
      marked: req.body.marked,
      present: req.body.present,
      extratime: req.body.etb,
      attby: tp,
    }, { where: { emp_id: req.body.empid , monthyear:req.body.monthyear} }).then((att) => {
      return res.send({
        message: "true"
      })

    }).catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not update configurations"
      })
    })

  } else {
    Att.update({
      marked: req.body.marked,
      present: req.body.present,
      extratime: req.body.etb,
      quick: req.body.dx + req.body.quick,
      attby: tp,
    }, { where: { emp_id: req.body.empid  , monthyear:req.body.monthyear} }).then((att) => {
      return res.send({
        message: "true"
      })

    }).catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not update configurations"
      })
    })

  }

})
route.get('/api/report', authCheckedit, (req, res) => {
  console.log(req.query.m)
  Att.findOne({ where: { emp_id: req.query.n, monthyear: arr[req.query.m] + req.query.y } })
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



module.exports = route