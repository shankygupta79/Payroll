const express = require('express');
const SERVER_PORT = process.env.PORT || 3420
const path = require('path')
const app = express();
const authroutes = require('./routes/auth-routes').route
const passportSetup = require('./config/passport-setup')
const cookieSession = require('cookie-session')
const passport = require('passport')
const dotenv = require("dotenv")
var bodyParser = require('body-parser');

dotenv.config()
const profileroutes = require('./routes/profile-routes').route
var cors = require('cors')
var whitelist = ['https://www.lovebirdlingerie.com', 'http://dev.lovebirdlingerie.com', 'http://manager.lovebirdlingerie.com'];

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));
app.use(cookieSession({
    maxAge: 2 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
}))
//initialoze passport
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.set('views', path.join(__dirname, 'views/'));
app.use((req, res, next) => {
    next()
})


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', require('./routes/api').route)
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
app.use('/notification', require('./routes/notification'));
app.use('/lovebirdnotification', require('./routes/lovebirdnotification'));
app.listen(SERVER_PORT, function () {
    console.log("Server started on https://payrollv2.herokuapp.com/");
});



//set up routes
app.use('/auth', authroutes)
app.use('/profile', profileroutes)
app.get('/success', (req, res) => {
    res.sendStatus(200);
})
//taskkill/f /im node.exe