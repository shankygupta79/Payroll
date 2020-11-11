const route = require('express').Router();
var crypto = require('crypto'); 
const flash = require('connect-flash')
route.use(flash())
var CryptoJS = require("crypto-js");
const passport = require('passport')
const path = require('path')
const User = require('../database').User;
const dotenv = require("dotenv")
dotenv.config()
//auth login
route.get('/login',(req,res)=>{
    res.render('login',{user:req.user})
})
//auth logout
route.get('/logout',(req,res)=>{
    //handle with passport
    req.logout()
    res.redirect('/')
})  
//auth with google
route.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))
route.get('/facebook',passport.authenticate('facebook',{
    scope: [ 'email', 'public_profile']
}))
route.get('/facebook/redirect',passport.authenticate('facebook',{failureRedirect: '/login'}),(req,res)=>{
    res.redirect('/dashboard')
})
route.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/sign.html'),{user:req.user})
})

route.post('/signup',passport.authenticate('signup',{
    successRedirect: '/profile',
    failureRedirect: '/auth/signup',
    failureFlash:true
}))
route.get('/local',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'),{message:req.flash('error')})
})
route.get('/failureDirect',(req,res)=>{
    res.status(200).send(req.flash('error'));
})
route.get('/successDirect',(req,res)=>{
    const token=CryptoJS.AES.encrypt(req.user[0].id+"", process.env.appkey).toString();
    const fullname=req.user[0].fullname
    const access=CryptoJS.AES.encrypt(req.user[0].access="", process.env.appkey).toString();
    const currency=req.user[0].currency
    const office_close=req.user[0].office_close
    const logo=req.user[0].logo
    const admin=CryptoJS.AES.encrypt(req.user[0].admin+"", process.env.appkey).toString();
    const token2=CryptoJS.AES.encrypt(req.user[0].userId+"", process.env.appkey).toString();
    res.status(200).send(['true',token,fullname,access,currency,office_close,logo,admin,token2]);
})
route.post('/local',passport.authenticate('login',{
    successRedirect: '/auth/successDirect',
    failureRedirect: '/auth/failureDirect',
    failureFlash: true
 }));
route.get('/login.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'../css/login.css'))
})
//calback route for google to redirect
route.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    //res.send( req.user)
    res.redirect('/dashboard')
})
exports = module.exports = {
    route
}