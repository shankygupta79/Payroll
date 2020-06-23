const route = require('express').Router()
const Emp = require('../database').Employeeqdb
const Att = require('../database').Attendance
const path = require('path')
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const authCheckview = (req, res, next) => {
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
const authCheckedit = (req, res, next) => {
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
route.get('/calc', authCheckedit, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/calculator.html'))
})
route.get('/list', authCheckview, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/paylist.html'))
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
route.post('/api/calc', authCheckedit, (req, res) => {
    console.log(req.body.id)
    Att.update({
        advance: req.body.advance,
        extratimetotoal: req.body.extra,
        holidays: req.body.holidays,
        text: req.body.comment,
        bonus: req.body.bonus,
        deduction: req.body.deduction,
        balance: req.body.balance,
        transfer: req.body.transfer,
        netpay: req.body.netpay,
    }, { where: { emp_id: req.body.id } }).then((att) => {
        return res.send({
            message: "true"
        })

    }).catch((err) => {
        console.log(err)
        return res.send({
            message: "Could not update configurations"
        })
    })

})
route.get('/api/data', authCheckview, (req, res) => {

    Emp.hasMany(Att, { foreignKey: 'emp_id' })
    Att.belongsTo(Emp, { foreignKey: 'emp_id' })

    Att.findAll({ where: { monthyear: req.query.date, userId: xid }, include: [Emp] })
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