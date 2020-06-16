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
route.get('/add_holiday', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_holiday.html'))
})
route.get('/manage_holiday', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_holiday.html'))
})
route.get('/edit_holiday', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/edit_holiday.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/holiday.css'))

})



module.exports = route