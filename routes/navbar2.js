const route = require('express').Router()

const path = require('path')
route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './navbar.js'))
})
route.get('/collapsing', (req, res) => {
  res.sendFile(path.join(__dirname, './collapsing.js'))
})

module.exports = route