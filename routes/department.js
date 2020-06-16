const route = require('express').Router()
const path = require('path')
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
const authCheck = (req, res, next) => {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    //if logged in
    next()
  }
}
route.get('/add_dep', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_dep.html'))
})
route.get('/manage_dep', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_dep.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/dep.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})

module.exports = route