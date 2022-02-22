const route = require('express').Router()
const User = require('../database').User
const path = require('path')
const axios = require('axios')
const webpush = require('web-push');
const dotenv = require("dotenv")
dotenv.config()

webpush.setGCMAPIKey(process.env.lovebird_key1);
webpush.setVapidDetails(
    'mailto:shankygupta79@gmail.com',
    'BNsaGnpAg8LLdahom7pPF8JW37SBg4W8Jz3bmbPpF3ntoN77BJMSD2gS2XyqEuJAneThxdjjF8hPzSj-hUsI074',
    process.env.lovebird_key2
);

route.post('/send', async (req, res) => {
    console.log("Hey Lovebird Notifi Main aa gaya")
    var tokenArr = req.body.tokenArr;
    var payloads = req.body.payloads;
    for(var i=0;i<tokenArr.length;i++){
        try{
            console.log("i="+i)
            console.log(payloads)
            var x = await webpush.sendNotification(tokenArr[i],payloads);
            console.log(x)
        }catch(e){
            console.log(e)
        }
    }
    return res.send({
        result: "Success",
        message: "Some Error Occured in our Database ! "
    })

})
module.exports = route