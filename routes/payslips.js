const route = require('express').Router()

const path = require('path')
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const authCheck = (req, res, next) => {
    if (isEmpty(req.user)) {
        //user is not logged in
        res.redirect('/login')
    } else {
        //if logged in
        next()
    }
}
route.get('/calc', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/calculator.html'))
})
route.get('/list', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/paylist.html'))
})
route.get('/printsingle', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/print_single.html'))
})
route.get('/printmultiple', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/print_multiple.html'))
})
route.get('/printcss', authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, '../css/printcss.css'))
})

route.get('/css', (req, res) => {

    res.sendFile(path.join(__dirname, '../css/payslips.css'))

})



module.exports = route