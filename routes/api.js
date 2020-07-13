const route = require('express').Router();
var crypto = require('crypto');
const Sequelize = require('sequelize')
var path = require('path')
const User = require('../database').User
const Setting = require('../database').Setting
const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config()
route.get('/', (req, res) => {
    res.redirect('https://payrollv2.herokuapp.com/login')
})


route.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/sign.html'))
})
route.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'))
})
route.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/privacy-policy.html'))
})
route.post('/forgotpassword', (req, res) => {
    var email = req.body.email;
    User.findOne({ where: { emailId: email, authenticationType: 'local' } })
        .then((user) => {
            sendmail(user.emailId, user.password, 1);
            return res.send({ data: 'true' })
        }).catch((err) => {
            return res.send({ data: 'No user' })
        })
})
route.post('/updatepassword', (req, res) => {
    var newsalt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(req.body.password, newsalt, 1000, 64, `sha512`).toString(`hex`);

    User.update({
        salt: newsalt,
        password: hash
    }, { where: { emailId: req.body.mail } })
        .then((user) => {
            return res.send({ data: 'true' })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send({
                error: "Could not activate the user"
            })
        })
})
route.get('/signup/css', (req, res) => {
    res.sendFile(path.join(__dirname, '../css/login.css'))
})
route.get('/signup/css2', (req, res) => {
    res.sendFile(path.join(__dirname, '../css/main.css'))
})
route.get('/forgotpassword', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/forgotpass.html'))
})
route.get('/forgotpassword/css', (req, res) => {
    res.sendFile(path.join(__dirname, '../css/forgotpass.css'))
})
route.get('/activate', (req, res) => {
    var d = new Date();
    var tmnew = d.getTime();
    console.log(req.query.tm)
    if (tmnew - req.query.tm < 300000) {
        res.sendFile(path.join(__dirname, '../views/updatepass.html'))
        User.update({
            valid: true
        }, { where: { emailId: req.query.mail, password: req.query.id } })
            .then((user) => {
            })
            .catch((err) => {
                console.log(err)
                res.status(500).send({
                    error: "Could not activate the user"
                })
            })
    } else {
        res.send({ message: "Activation Link Expired" })
    }
    res.redirect('/login');
})

route.get('/forgot', (req, res) => {
    var d = new Date();
    var tmnew = d.getTime();
    console.log(tmnew)
    if (tmnew - req.query.tm < 300000) {
        res.sendFile(path.join(__dirname, '../views/updatepass.html'))
    } else {
        res.send({ message: "Timed Out" })
    }


})
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
mailing_id = '';
hash = ''
route.post('/signup', (req, res) => {
    var salt_1 = crypto.randomBytes(16).toString('hex');
    var hash_password = crypto.pbkdf2Sync(req.body.password, salt_1, 1000, 64, `sha512`).toString(`hex`);
    mailing_id = req.body.email;
    hash = hash_password;
    User.findOne({ where: { emailId: req.body.email } })
        .then((user) => {
            console.log(user)
            if (!isEmpty(user)) {
                var users = [user.dataValues];
                if (users[0].authenticationType == 'Google') {
                    return res.status(200).send({ data: 'ug' })
                } else if (users[0].authenticationType == 'Facebook') {
                    return res.status(200).send({ data: 'uf' })
                } else {
                    return res.status(200).send({ data: 'ae' })
                }
            } else {
                User.create({
                    username: req.body.username,
                    emailId: req.body.email,
                    thumbnail: 'https://res.cloudinary.com/shankygupta79/image/upload/v1592562756/profile_iz3s6y.jpg',
                    fullname: req.body.name,
                    authenticationType: 'local',
                    salt: salt_1,
                    password: hash_password,
                    valid: false,
                    admin: 1,
                    currency: '₹',
                    logo: "https://res.cloudinary.com/shankygupta79/image/upload/v1592489600/love_bird_transparent_bg_dlwkpq.png",
                    office_close: '0000000',
                }).then((user) => {
                    
                    Setting.create({
                        userId:user.id,
                    })
                    .then((setting)=>{
                        sendmail(mailing_id, hash, 0);
                        return res.send({ data: 'ms', email: req.body.email })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                    return res.send({ data: 'error' })
                })

            }



        })

})
function sendmail(tomailid, hash, fp) {
    var d = new Date();
    var tm = d.getTime();
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        //zebcrxozzvbluqri
        auth: {
            user: process.env.mail,
            pass: process.env.mpassword
        }
    });
    let mailDetails = {}
    if (fp == 1) {
        mailDetails = {
            from: process.env.mail,
            to: tomailid,
            subject: 'Reset Your Password',
            text: 'Reset your password by clicking on the link (link is valid upto five minutes only) ' + 'https://payrollv2.herokuapp.com/forgot?id=' + hash + '&tm=' + tm + '&mail=' + tomailid,
        };
    } else if (fp == 0) {
        mailDetails = {
            from: process.env.mail,
            to: tomailid,
            subject: 'Activate Your Account',
            text: 'Verify your account by clicking on the link ' + 'https://payrollv2.herokuapp.com/activate?id=' + hash + '&mail=' + tomailid + '&tm=' + tm + ' .' + 'This Link will expire in 10 minutes',
        };
    }
    // https://myaccount.google.com/lesssecureapps
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs mailing to ' + tomailid + err);
        } else {
            console.log('Email sent successfully to ' + tomailid);
        }
    });
}




exports = module.exports = {
    route, mailing_id
}