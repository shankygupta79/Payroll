const route = require('express').Router()
const path = require('path')
const Emp = require('../database').Employeedb
const Empq = require('../database').Employeeqdb
const multer = require('multer');
const sizeOf = require('image-size');
const cloudinary = require('cloudinary');
var arr2=[]
var photu='https://res.cloudinary.com/shankygupta79/image/upload/v1592573101/emp_man2_2_cazxts.jpg'
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});


var upload = multer({ dest:'uploads/'});
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
route.get('/add_emp', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_emp.html'))
})
route.get('/manage_emp', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_emp.html'))
})
route.get('/edit_emp', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/edit_emp.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/emp.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})
route.post('/add_empdata', authCheck, (req, res) => {
  console.log("Hey")
  if(req.body.gender=='Female'){
    photu="https://res.cloudinary.com/shankygupta79/image/upload/v1592573098/emp_fem_y1vkfa.jpg";
  }
  Emp.create({
    userId: xid,
    fname: req.body.fname,
    mname: req.body.mname,
    gender: req.body.gender,
    dob: req.body.dob,
    aadhaar: req.body.aadhaar,
    pan: req.body.pan,
    fnum: req.body.fnum,
    mnum: req.body.mnum,
    anum: req.body.anum,
    add1: req.body.add1,
    add2: req.body.add2,
    land: req.body.land,
    salary: req.body.salary,
    bname: req.body.bname,
    ifsc: req.body.ifsc,
    accnum: req.body.accnum,
    accname: req.body.accname,
    branch: req.body.branch,
    status: req.body.status,
    photo: photu,
    doc1: arr2[0],
    doc2: arr2[1],
    doc3: arr2[2],
    doc4: arr2[3],
    doc5: arr2[4],
  }).then((user) => {
    Empq.create({

      userId: xid,
      name: req.body.name,
      doj: req.body.doj,
      des: req.body.des,
      dep: req.body.dep,
      email: req.body.email,
      pnum: req.body.phone,

    }).then((user) => {
      console.log("Employee Added Done !")
      return res.send({ message: 'true' })
    }).catch((err) => {
      console.log(err)
      res.status(500).send({
        message: 'Some error occured in database ! ' 
      })
    })
  }).catch((err) => {
    console.log(err)
    res.status(500).send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.get('/api/quickemp', authCheck, (req, res) => {
  Empq.findAll({ where: { userId: xid } })
    .then((emps) => {
      res.status(200).send(emps)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        message: "Could not retrive employees"
      })
    })

})
route.post('/add_emp/upload', upload.array('file', 5), (req, res) => {
    if (!req.files[0].mimetype.startsWith('image/')) {
      return res.status(422).json({
        error: 'The uploaded file must be an image'
      });
    }
    cloudinary.v2.uploader.upload(req.files[0].path,
      function (error, result) {
        link = result.url;
        arr2.push(result.url)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send({
          error: "Could not upload image"
        })
      });
  return res.send({message:"Done"})


});
route.post('/add_emp/uploadpr', upload.single('file'), (req, res) => {
  console.log("AYA")
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    });
  }
  cloudinary.v2.uploader.upload(req.file.path,
    function (error, result) {
      photu = result.url;
      console.log(photu)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        error: "Could not upload image"
      })
    });
  return res.send({message:"Done"})


});

module.exports = route