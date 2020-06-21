const route = require('express').Router()
const path = require('path')
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var xid = 0;
const authCheck = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    xid = req.user[0].id
    console.log(xid)
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

module.exports = route