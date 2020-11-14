const route = require('express').Router()
const path = require('path')
const Emp = require('../database').Employeedb
const Att = require('../database').Attendance
const Empq = require('../database').Employeeqdb
const User = require('../database').User
const multer = require('multer');
const sizeOf = require('image-size');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
var arr2 = []
var photu = ''
var CryptoJS = require("crypto-js");
AWS.config.update({ accessKeyId: process.env.BKey, secretAccessKey: process.env.BSecret });
const endpoint = new AWS.Endpoint(process.env.BHost);

const s3 = new AWS.S3({ endpoint });


var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'payrollbucket2',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
    }
  })
});
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
var xid = 0;
var symbol = '';
const authCheckview = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin+"", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin=0
      var y = CryptoJS.AES.decrypt(req.query.access+"", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
      if (y[0] == 'false') {
        return res.send(false)
      }
      xid = CryptoJS.AES.decrypt(req.query.id2+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
    } else {
      admin=1
      xid = CryptoJS.AES.decrypt(req.query.id+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
      console.log(xid)
    }
    office = req.query.off
    next()
  } else {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    symbol = req.user[0].currency
    if (req.user[0].admin == '0') {
      xid = req.user[0].userId
      var y = req.user[0].access.split(';')
      if (y[0] == 'false') {

        res.redirect('../users/lock')
      }
    } else {
      xid = req.user[0].id
    }
    console.log(xid)
    next()
  }}
}
const authCheckedit = (req, res, next) => {
  if (req.query.platform == "APP") {
    if (CryptoJS.AES.decrypt(req.query.admin+"", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
      admin=0
      var y = CryptoJS.AES.decrypt(req.query.access+"", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
      if (y[1] == 'false') {
        return res.send(false)
      }
      xid = CryptoJS.AES.decrypt(req.query.id2+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
    } else {
      admin=1
      xid = CryptoJS.AES.decrypt(req.query.id+"", process.env.appkey).toString(CryptoJS.enc.Utf8)
      console.log(xid)
    }
    office = req.query.off
    next()
  } else {
  if (isEmpty(req.user)) {
    //user is not logged in
    res.redirect('/login')
  } else {
    if (req.user[0].admin == '0') {
      xid = req.user[0].userId
      var y = req.user[0].access.split(';')
      if (y[1] == 'false') {
        return res.send({ message: "You dont have access to edit " })
      }
    } else {
      xid = req.user[0].id
    }
    console.log(xid)
    next()
  }}
}
route.get('/add_emp', authCheckedit, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/add_emp.html'))
})
route.get('/manage_emp', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/manage_emp.html'))
})
route.get('/edit_emp', authCheckview, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/edit_emp.html'))
})
route.get('/css', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/emp.css'))

})
route.get('/style2', (req, res) => {

  res.sendFile(path.join(__dirname, '../css/style2.css'))

})
route.post('/edit_empdata', authCheckedit, (req, res) => {
  console.log("EDIT API")
  if (req.body.doc1 != '') {
    arr2.push(req.body.doc1)
  }
  if (req.body.doc2 != '') {
    arr2.push(req.body.doc2)
  }
  if (req.body.doc3 != '') {
    arr2.push(req.body.doc3)
  }
  if (req.body.doc4 != '') {
    arr2.push(req.body.doc4)
  }
  if (req.body.doc5 != '') {
    arr2.push(req.body.doc5)
  }
  Emp.update({
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
    bname: req.body.bname,
    ifsc: req.body.ifsc,
    accnum: req.body.accnum,
    accname: req.body.accname,
    branch: req.body.branch,
    doc1: arr2[0],
    doc2: arr2[1],
    doc3: arr2[2],
    doc4: arr2[3],
    doc5: arr2[4],

  }, { where: { userId: xid, emp_id: req.body.empid } }).then((user) => {
    if (photu == '') {
      photu = req.body.photo
    }
    Empq.update({
      name: req.body.name,
      doj: req.body.doj,
      des: req.body.des,
      dep: req.body.dep,
      email: req.body.email,
      pnum: req.body.pnum,
      photo: photu,
      status: req.body.status,
      salary: req.body.salary,

    }, { where: { userId: xid, emp_id: req.body.empid } }).then((user) => {
      photu = "",
        arr2 = [],
        console.log("Employee Edited Successfully !")
      return res.send({ message: 'true' })
    }).catch((err) => {
      console.log(err)
      return res.send({
        message: 'Some error occured in database ! '
      })
    })
  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.post('/add_empdata', authCheckedit, (req, res) => {
  console.log("Hey")
  if (photu == '') {
    photu = "https://res.cloudinary.com/shankygupta79/image/upload/v1592573101/emp_man2_2_cazxts.jpg";
    if (req.body.gender == 'Female') {
      photu = "https://res.cloudinary.com/shankygupta79/image/upload/v1592573098/emp_fem_y1vkfa.jpg";
    }
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
    bname: req.body.bname,
    ifsc: req.body.ifsc,
    accnum: req.body.accnum,
    accname: req.body.accname,
    branch: req.body.branch,
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
      salary: req.body.salary,
      des: req.body.des,
      dep: req.body.dep,
      email: req.body.email,
      pnum: req.body.phone,
      photo: photu,
      status: req.body.status,
      totalloan: 0,
    }).then((user) => {
      arr2 = [];
      photu = '';
      if (req.body.status == 'Active') {
        var a0 = new Date().getTime() + 60 * 60 * 1000 * 5.5;
        var dt = new Date(a0);
        var dt1 = dt.getDate()
        if (dt1 < 10) {
          dt1 = 0 + "" + dt1
        }
        var mt = dt.getMonth()
        mt = mt + 1
        if (mt < 10) {
          mt = 0 + "" + mt
        }
        var present = ""
        var marked = ""
        var attby = ""
        console.log(parseInt(dt1))
        for (var i = 1; i <= 31; i++) {
          if (i <= parseInt(dt1)) {
            present = present + "A"
            marked = marked + "1"
            attby = attby + "1"
          } else {
            present = present + "-"
            marked = marked + "0"
            attby = attby + "0"
          }
        }
        Att.create({
          userId: xid,
          emp_id: user.emp_id,
          monthyear: mt + "-" + dt.getFullYear(),
          present: present,
          marked: marked,
          quick: parseInt(dt1) + 'A',
          holidays: 0,
          extratimetotoal: 0,
          extratime: "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0",
          advance: 0,
          bonus: 0,
          deduction: 0,
          balance: 0,
          transfer: 0,
          attby: attby,
          text: "No Comments",
          netpay: 0,
          emi: 0,
        }).then((att) => {
          console.log("Employee Added Done !")
          return res.send({ message: 'true' })

        })
          .catch((err) => {
            console.log(err)
            return res.send({
              message: "Could not retrive employees"
            })
          })

      }

    }).catch((err) => {
      console.log(err)
      return res.send({
        message: 'Some error occured in database ! '
      })
    })
  }).catch((err) => {
    console.log(err)
    return res.send({
      message: "Some Error Occured in our Database ! "
    })
  })
})
route.get('/api/quickemp', authCheckview, (req, res) => {
  if (req.query.empid != undefined) {
    Empq.findOne({ where: { userId: xid, emp_id: req.query.empid } })
      .then((emps) => {
        res.status(200).send(emps)
      })
      .catch((err) => {
        console.log(err)
        return res.send({
          message: "Could not retrive employees"
        })
      })
  } else {
    Empq.findAll({ where: { userId: xid } })
      .then((emps) => {
        res.status(200).send(emps)
      })
      .catch((err) => {
        console.log(err)
        return res.send({
          message: "Could not retrive employees"
        })
      })
  }
})
route.post('/api/active', authCheckedit, (req, res) => {
  var a0 = new Date().getTime() + 60 * 60 * 1000 * 5.5;
  var dt = new Date(a0);
  var dt1 = dt.getDate()
  if (dt1 < 10) {
    dt1 = 0 + "" + dt1
  }
  var mt = dt.getMonth()
  mt = mt + 1
  if (mt < 10) {
    mt = 0 + "" + mt
  }
  var present = ""
  var marked = ""
  var attby = ""
  console.log(parseInt(dt1))
  console.log(req.body.status)
  if (req.body.status == "Active") {

    for (var i = 1; i <= 31; i++) {
      if (i <= parseInt(dt1)) {
        present = present + "A"
        marked = marked + "1"
        attby = attby + "1"
      } else {
        present = present + "-"
        marked = marked + "0"
        attby = attby + "0"
      }
    }
    Att.create({
      userId: xid,
      emp_id: req.body.emp_id,
      monthyear: mt + "-" + dt.getFullYear(),
      present: present,
      marked: marked,
      quick: parseInt(dt1) + 'A',
      holidays: 0,
      extratimetotoal: 0,
      extratime: "0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0",
      advance: 0,
      bonus: 0,
      deduction: 0,
      balance: 0,
      transfer: 0,
      attby: attby,
      text: "No Comments",
      netpay: 0,
      emi: 0,
    }).then((att) => {
      return res.send({
        message: "true"
      })

    })
      .catch((err) => {
        console.log(err)
        return res.send({
          message: "Could not retrive employees"
        })
      })


  } else {
    //MAKING INACTIVE
    Att.findOne({ where: { emp_id: req.body.emp_id, monthyear: mt + "-" + dt.getFullYear() } })
      .then((att) => {
        for (var i = 1; i <= 31; i++) {
          if (i >= parseInt(dt1)) {
            present = present + "A"
            marked = marked + "1"
            attby = attby + "1"
          }
        }
        present = att.present.slice(0, dt1 - 1) + present
        marked = att.marked.slice(0, dt1 - 1) + marked
        attby = att.attby.slice(0, dt1 - 1) + attby
        Att.update({
          present: present,
          marked: marked,
          attby: attby,
          quick: parseInt(dt1) + "A",

        }, { where: { emp_id: req.body.emp_id, monthyear: mt + "-" + dt.getFullYear() } })
        return res.send({
          message: "true"
        })

      })
      .catch((err) => {
        console.log(err)
        return res.send({
          message: "Could not retrive employees"
        })
      })

  }



})
route.get('/api/quickempactive', authCheckview, (req, res) => {
  Empq.findAll({ where: { userId: xid, status: 'Active' } })
    .then((emps) => {
      res.status(200).send(emps)
    })
    .catch((err) => {
      console.log(err)
      return res.send({
        message: "Could not retrive employees"
      })
    })
})
route.get('/api/emp', authCheckview, (req, res) => {
  console.log(req.query)
  Emp.findOne({ where: { userId: xid, emp_id: req.query.empid } })
    .then((emps) => {
      res.status(200).send([emps, symbol])
    })
    .catch((err) => {
      console.log(err)
      return res.send({
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
  link = req.files[0].location;
  arr2.push(link)
  console.log(arr2)
  return res.send({ message: "Done" })

});
route.post('/add_emp/uploadpr', upload.single('file'), (req, res) => {
  console.log("AYA")
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    });
  }
  photu = req.file.location;
  console.log(photu)
  return res.send({ message: "Done" })
});

module.exports = route