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
route.get('/api',authCheck,(req,res)=>{
  res.status(200).send(req.user[0]);
})
route.get('/',authCheck,(req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/dashboard.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})


module.exports = route