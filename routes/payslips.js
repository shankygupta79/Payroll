const route = require('express').Router()
const Emp = require('../database').Employeeqdb
const Att = require('../database').Attendance
const Loan = require('../database').Loan
const Adv = require('../database').Adv
const path = require('path')
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const authCheckview = (req, res, next) => {
    if (req.query.platform == "APP") {
        if (CryptoJS.AES.decrypt(req.query.admin+"", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
          admin=0
          var y = CryptoJS.AES.decrypt(req.query.access+"", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
          if (y[8] == 'false') {
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
            if (y[8] == 'false') {

                res.redirect('../users/lock')
            }
        } else {
            xid = req.user[0].id
        }
        console.log(xid)
        next()
    }
}
}
const authCheck = (req, res, next) => {
    
    if (isEmpty(req.user)) {
        //user is not logged in
        res.redirect('/login')
    } else {
        if (req.user[0].admin == '0') {
            res.redirect('../users/lock')
        }
        xid = req.user[0].id
        next()
    }
}
const authCheckedit = (req, res, next) => {
    if (req.query.platform == "APP") {
        if (CryptoJS.AES.decrypt(req.query.admin+"", process.env.appkey).toString(CryptoJS.enc.Utf8) == '0') {
          admin=0
          var y = CryptoJS.AES.decrypt(req.query.access+"", process.env.appkey).toString(CryptoJS.enc.Utf8).split(';')
          if (y[9] == 'false') {
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
            if (y[9] == 'false') {
                return res.send({ message: "You dont have access to edit " })
            }
        } else {
            xid = req.user[0].id
        }
        next()
    }
}
}
route.get('/calc', authCheckedit, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/calculator.html'))
})
route.get('/ledger', authCheckview, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/ledger.html'))
})
route.get('/list', authCheckview, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/paylist.html'))
})
route.get('/loan', authCheckedit, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/loan.html'))
})
route.get('/entry', authCheckedit, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/add_entry.html'))
})
route.get('/adv', authCheckedit, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/adv.html'))
})
route.get('/entry_adv', authCheckedit, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/add_adv.html'))
})
route.get('/printsingle', authCheckview, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/print_single.html'))
})
route.get('/printmultiple', authCheckview, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/print_multiple.html'))
})
route.get('/printcss', (req, res) => {
    res.sendFile(path.join(__dirname, '../css/printcss.css'))
})

route.get('/css', (req, res) => {

    res.sendFile(path.join(__dirname, '../css/payslips.css'))

})
var abc = '';
function update(data, x, data2) {
    return Att.update({
        advance: data.advance,
        extratimetotoal: data.extratimetotoal,
        holidays: data.holidays,
        text: data.text,
        bonus: data.bonus,
        deduction: data.deduction,
        balance: parseInt(data['employee_quick'].salary) + parseInt(data.bonus) + parseInt(data.extratimetotoal) - parseInt(data.deduction) - parseInt(data.advance) - parseInt(data.holidays) - parseInt(data.emi),
        transfer: data.transfer,
        emi: data.emi,
        netpay: parseInt(data['employee_quick'].salary) + parseInt(data.bonus) + parseInt(data.extratimetotoal) - parseInt(data.deduction) - parseInt(data.advance) - parseInt(data.holidays) - parseInt(data.transfer) - parseInt(data.emi),
    }, { where: { emp_id: data['employee_quick'].emp_id, monthyear: x } })
        .then(async (att) => {
            var amount0 = data.emi - data.emiold
            if (amount0 != 0) {
                return await loanadd(amount0, 1, "Monthly EMI Deduction of " + month[parseInt(x.slice(0, 2)) - 1], abc, data['employee_quick'].emp_id)
            } else {
                return true
            }

        }).catch((err) => {
            console.log(err)
            return false
        })
}


route.post('/api/calc', authCheckedit, async (req, res) => {
    var d = new Date()
    var dt = d.getDate()
    var mt = d.getMonth()
    if (dt < 10) {
        dt = 0 + "" + dt;
    }
    mt = mt + 1;
    if (mt < 10) {
        mt = 0 + "" + mt;
    }
    abc = dt + "-" + mt + "-" + d.getFullYear();
    for (var i = 0; i < req.body.list.length; i++) {
        var a = await update(req.body.list[i], req.body.x)
        if (a == true) {

        }
    }
    return res.send({
        message: "true"
    })


})
function loanadd(amount, type, text, date, emp_id) {
    return Loan.create({
        userId: xid,
        amount: amount,
        text: text,
        emp_id: emp_id,
        date: date,
        type: type,

    }).then(() => {
        if (type == 0) {
            return Emp.increment({
                totalloan: amount
            }, { where: { emp_id: emp_id } })
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    return false;
                })
        } else {
            Emp.increment({
                totalloan: (amount * -1)
            }, { where: { emp_id: emp_id } })
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    return false;
                })
        }


    }).catch((err) => {
        console.log(err)
        return false
    })
    return true
}
function advadd(amount, type, text, date, emp_id, monthyear) {
    return Adv.create({
        userId: xid,
        amount: amount,
        text: text,
        emp_id: emp_id,
        date: date,
        type: type,
        monthyear: monthyear,

    }).then(() => {
        if (type == 0) {
            return Att.increment({
                advance: amount
            }, { where: { emp_id: emp_id, monthyear: monthyear } })
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    return false;
                })
        } else {
            Att.increment({
                advance: (amount * -1)
            }, { where: { emp_id: emp_id, monthyear: monthyear } })
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    console.log(err)
                    return false;
                })
        }


    }).catch((err) => {
        console.log(err)
        return false
    })
    return true
}

route.post('/loanadd', authCheckedit, async (req, res) => {
    console.log("Hey")
    if (req.body.text == '') {
        req.body.text = "No Comments"
    }
    var y = loanadd(req.body.amount, req.body.type, req.body.text, req.body.date, req.body.emp_id)
    setTimeout(() => {
        return res.send({
            message: "true"
        })
    }, 200)
})
route.post('/advadd', authCheckedit, async (req, res) => {
    console.log("Hey")
    if (req.body.text == '') {
        req.body.text = "No Comments"
    }
    var y = advadd(req.body.amount, req.body.type, req.body.text, req.body.date, req.body.emp_id, req.body.monthyear)
    setTimeout(() => {
        return res.send({
            message: "true"
        })
    }, 200)
})
route.get('/api/data', authCheckview, (req, res) => {
    if (req.query.emp != undefined) {
        Emp.hasMany(Att, { foreignKey: 'emp_id' })
        Att.belongsTo(Emp, { foreignKey: 'emp_id' })

        Att.findOne({ where: { monthyear: req.query.date, userId: xid ,emp_id:req.query.emp }, include: [Emp] })
            .then((emps) => {
                return res.status(200).send(emps)
            })
            .catch((err) => {
                console.log(err)

            })
    } else {
        Emp.hasMany(Att, { foreignKey: 'emp_id' })
        Att.belongsTo(Emp, { foreignKey: 'emp_id' })

        Att.findAll({ where: { monthyear: req.query.date, userId: xid }, include: [Emp] })
            .then((emps) => {
                return res.status(200).send(emps)
            })
            .catch((err) => {
                console.log(err)

            })
    }
})
route.get('/getloan', authCheckview, (req, res) => {

    Loan.findAll({ where: { emp_id: req.query.id, userId: xid } })
        .then((emps) => {
            return res.status(200).send(emps)
        })
        .catch((err) => {
            console.log(err)
            res.send({
                message: "Could not retrive info "
            })

        })
})
route.get('/getadv', authCheckview, (req, res) => {

    Adv.findAll({ where: { emp_id: req.query.id, userId: xid, monthyear: req.query.monthyear } })
        .then((emps) => {
            return res.status(200).send(emps)
        })
        .catch((err) => {
            console.log(err)
            res.send({
                message: "Could not retrive info "
            })

        })
})
route.get('/api/dataprint', authCheckedit, (req, res) => {

    Emp.hasMany(Att, { foreignKey: 'emp_id' })
    Att.belongsTo(Emp, { foreignKey: 'emp_id' })

    Att.findOne({ where: { emp_id: req.query.id, monthyear: req.query.date }, include: [Emp] })
        .then((emps) => {
            return res.status(200).send(emps)
        })
        .catch((err) => {
            console.log(err)
            res.send({
                message: "Could not retrive info "
            })
        })
})


module.exports = route