const route = require('express').Router()
const path = require('path')
const Sequelize = require('sequelize')
const Department = require('../database').Department
const Employee = require('../database').Employeeqdb
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var xid = 0;
const authCheckview = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      xid = req.user[0].userId
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
const authCheckedit = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      xid = req.user[0].userId
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
    userId: xid,
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

  Department.findAll({ where: { userId: xid } })
    .then((emps) => {
      res.status(200).send(emps)
    })
    .catch((err) => {
      console.log(err)
      res.send({
        message: "Could not retrive users"
      })
    })

})
route.get('/api/dep2', authCheckview, (req, res) => {

  Employee.findAll({
    group: ['dep'],
    attributes: ['dep', [Sequelize.fn('COUNT', 'dep'), 'depcount']],
  })
    .then((emps) => {
      res.status(200).send(emps)
    })
    .catch((err) => {
      console.log(err)
      res.send({
        message: "Could not retrive employees"
      })
    })

})
route.post('/delete', authCheckedit, (req, res) => {
  console.log(req.query.id + " IN Delete")
  Department.destroy({
    where: {
      depname: req.query.id
    }
  }).then((dep) => {
    Employee.update({
      dep: 'unknown',
    }, { where: { dep: req.query.id } }).then((emps) => {
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