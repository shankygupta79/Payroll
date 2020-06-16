const route = require('express').Router()
const path=require('path')
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
route.get('/add_user', (req, res) => {
  res.sendFile(path.join(__dirname,'../views/add_user.html'))
})
route.get('/manage_user', authCheck,(req, res) => {
  res.sendFile(path.join(__dirname,'../views/manage_user.html'))
})
route.get('/edit_user',authCheck, (req, res) => {
  res.sendFile(path.join(__dirname,'../views/edit_user.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname,'../css/user.css'))

})



module.exports = route