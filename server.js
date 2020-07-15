const express = require('express');
const SERVER_PORT=process.env.PORT || 3420
const path=require('path')
const app = express();
const authroutes = require('./routes/auth-routes').route
const passportSetup = require('./config/passport-setup')
const cookieSession = require('cookie-session')
const passport = require('passport')
const dotenv = require("dotenv")
dotenv.config()
const profileroutes = require('./routes/profile-routes').route

app.use(cookieSession({
    maxAge:2*60*60*1000,
    keys:[process.env.cookieKey]
}))
//initialoze passport
app.use(passport.initialize())
app.use(passport.session())


app.set('views', path.join(__dirname, 'views/'));
app.use((req, res, next) => {
    next()
})

  
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/',require('./routes/api').route)
app.use('/login', require('./routes/login'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/employee', require('./routes/employee'));
app.use('/attendance', require('./routes/attendance'));
app.use('/department', require('./routes/department'));
app.use('/holiday', require('./routes/holiday'));
app.use('/users', require('./routes/users'));
app.use('/settings', require('./routes/settings'));
app.use('/navbar2', require('./routes/navbar2'));
app.use('/images', require('./routes/images'));
app.use('/payslips', require('./routes/payslips'));

app.listen(SERVER_PORT, function () {
    console.log("Server started on https://payroll.cleverapps.io/");
});



//set up routes
app.use('/auth',authroutes)
app.use('/profile',profileroutes)
app.get('/success',(req,res)=>{
    res.sendStatus(200);
})
//taskkill/f /im node.exe