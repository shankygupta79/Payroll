const route = require('express').Router()

const path = require('path')
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
const authCheck = (req,res,next)=>{
  if(isEmpty(req.user)){
      //user is not logged in
      res.redirect('/login')
  }else{
      //if logged in
      next()
  }
}
route.get('/daily_attendance',authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/daily_attendance.html'))
})
route.get('/attendance_report',authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/attendance_report.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/attendance.css'))

})



module.exports = route