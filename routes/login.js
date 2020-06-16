const route = require('express').Router()

const path=require('path')
route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../views/dashboard.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname,'../views/dashboard.css'))

})
route.get('/style2', (req, res) => {

    res.sendFile(path.join(__dirname,'../css/style2.css'))
  
  })
route.get('/catlist',(req,res)=>{
    Cat.findAll()
    .then((cat) => {
        res.status(200).send(cat)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send({
            error: "Could not retrive Category"
        })
    })  
})

module.exports = route