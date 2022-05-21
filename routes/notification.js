const route = require('express').Router()
const User = require('../database').User
const path = require('path')
const axios = require('axios')
route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/notification.html'))
})
route.get('/css', (req, res) => {

    res.sendFile(path.join(__dirname, '../css/holiday.css'))

})

route.post('/send', (req, res) => {
    console.log("Hey Notifi Main aa gaya")
    if (req.body.password == "0000") {
        User.findOne({ where: { id: req.body.id } })
            .then(async (user) => {
                console.log(user.expotoken)

                const a = await axios.post('https://exp.host/--/api/v2/push/send', {
                    "to": user.expotoken,
                    "body": req.body.body,
                    "title": req.body.title,
                    "enabled": true

                }, async function (data) {
                    console.log(data)
                    return data

                })

                if (a.status == 200) {
                    return res.send({
                        message: "true"
                    })
                } else {
                    return res.send({
                        message: "Some Error Occured in Expo"
                    })
                }
            }).catch((err) => {
                console.log(err)
                return res.send({
                    message: "Some Error Occured in our Database ! "
                })
            })

    } else {
        return res.send({
            message: "Wrong Password ! "
        })
    }
})
module.exports = route