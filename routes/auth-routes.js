const route = require('express').Router();
var crypto = require('crypto');
const flash = require('connect-flash')
route.use(flash())
const Setting = require('../database').Setting
var CryptoJS = require("crypto-js");
const passport = require('passport')
const path = require('path')
const User = require('../database').User;
const dotenv = require("dotenv")
dotenv.config()
//auth login
route.get('/login', (req, res) => {
    res.render('login', { user: req.user })
})
//auth logout
route.get('/logout', (req, res) => {
    //handle with passport
    req.logout()
    res.redirect('/')
})
//auth with google
route.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
route.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
}))
route.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/dashboard')
})
route.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/sign.html'), { user: req.user })
})

route.post('/signup', passport.authenticate('signup', {
    successRedirect: '/profile',
    failureRedirect: '/auth/signup',
    failureFlash: true
}))
route.get('/local', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'), { message: req.flash('error') })
})
route.get('/failureDirect', (req, res) => {
    res.status(200).send(req.flash('error'));
})
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
route.post('/googleapp', (req, res) => {
    console.log(req.body.user)
    var user = req.body.user
    User.findAll({ where: { userId: user.id, authenticationType: 'Google' } })
        .then((currentUser) => {
            if (!isEmpty(currentUser)) {
                //already user exist
                console.log("DEKHNA")
                currentUser=currentUser[0].dataValues
                const token = CryptoJS.AES.encrypt(currentUser.id + "", process.env.appkey).toString();
                const fullname = currentUser.fullname
                const access = CryptoJS.AES.encrypt(currentUser.access = "", process.env.appkey).toString();
                const currency = currentUser.currency
                const office_close = currentUser.office_close
                const logo = currentUser.logo
                const admin = CryptoJS.AES.encrypt(currentUser.admin + "", process.env.appkey).toString();
                const token2 = CryptoJS.AES.encrypt(currentUser.userId + "", process.env.appkey).toString();
               
                if(req.body.expotoken!=currentUser.Expotoken){
                    User.update({
                        Expotoken: req.body.expotoken,
                      }, { where: { id:currentUser.id} }).then((att) => {
                        return res.status(200).send(['true', token, fullname, access, currency, office_close, logo, admin, token2]);
                      })
                    }else{
                        return res.status(200).send(['true', token, fullname, access, currency, office_close, logo, admin, token2]);
                    }
            } else {
                User.create({
                    userId: user.id,
                    fullname: user.name,
                    thumbnail: user.photoUrl,
                    emailId: user.email,
                    authenticationType: 'Google',
                    admin: 1,
                    currency: '₹',
                    logo: "https://res.cloudinary.com/shankygupta79/image/upload/v1592489600/love_bird_transparent_bg_dlwkpq.png",
                    office_close: '0000000',
                    Expotoken:req.body.expotoken
                }).then((newUser) => {
                    Setting.create({
                        userId: newUser.id,
                    })
                        .then((setting) => {
                            console.log('new User Created', newUser)
                            newUser=newUser.dataValues
                            const token = CryptoJS.AES.encrypt(newUser.id + "", process.env.appkey).toString();
                            const fullname = newUser.fullname
                            const access = CryptoJS.AES.encrypt(newUser.access = "", process.env.appkey).toString();
                            const currency = newUser.currency
                            const office_close = newUser.office_close
                            const logo = newUser.logo
                            const admin = CryptoJS.AES.encrypt(newUser.admin + "", process.env.appkey).toString();
                            const token2 = CryptoJS.AES.encrypt(newUser.userId + "", process.env.appkey).toString();
                            res.status(200).send(['true', token, fullname, access, currency, office_close, logo, admin, token2]);
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(200).send(['false'])
                        })

                }).catch((err) => {
                    console.log(err)
                    res.status(200).send(['false'])
                })
            }
        })
})
route.get('/successDirect', (req, res) => {
    const token = CryptoJS.AES.encrypt(req.user[0].id + "", process.env.appkey).toString();
    const fullname = req.user[0].fullname
    const access = CryptoJS.AES.encrypt(req.user[0].access = "", process.env.appkey).toString();
    const currency = req.user[0].currency
    const office_close = req.user[0].office_close
    const logo = req.user[0].logo
    const admin = CryptoJS.AES.encrypt(req.user[0].admin + "", process.env.appkey).toString();
    const token2 = CryptoJS.AES.encrypt(req.user[0].userId + "", process.env.appkey).toString();


    
    res.status(200).send(['true', token, fullname, access, currency, office_close, logo, admin, token2]);
})
route.post('/local', passport.authenticate('login', {
    successRedirect: '/auth/successDirect',
    failureRedirect: '/auth/failureDirect',
    failureFlash: true
}));
route.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../css/login.css'))
})
//calback route for google to redirect
route.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //res.send( req.user)
    res.redirect('/dashboard')
})
exports = module.exports = {
    route
}