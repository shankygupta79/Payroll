const route = require('express').Router()
const path = require('path')
route.get('/loading', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/Loading2.gif'))
})
route.get('/emp_man', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/emp_man.jpg'))
})
route.get('/emp_fem', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/emp_fem.jpg'))
})
route.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/profile.jpg'))
})
route.get('/logo', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/logo2.png'))
})
route.get('/lock', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/lock.png'))
})
route.get('/left', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/left.png'))
})
route.get('/middle', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/middle.jpg'))
})
route.get('/right', (req, res) => {
  res.sendFile(path.join(__dirname, '../Images/right.jpg'))
})



module.exports = route