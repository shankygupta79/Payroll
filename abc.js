const webpush = require('web-push');
const dotenv = require("dotenv")
dotenv.config()
webpush.setGCMAPIKey(process.env.lovebird_key1);
webpush.setVapidDetails(
    'mailto:shankygupta79@gmail.com',
    'BNsaGnpAg8LLdahom7pPF8JW37SBg4W8Jz3bmbPpF3ntoN77BJMSD2gS2XyqEuJAneThxdjjF8hPzSj-hUsI074',
    process.env.lovebird_key2
);
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/fo-s9ig1UKk:APA91bFEKjVgXa6TXkB3Ir4yBZOaTbSi_7lkpK0G5byJxqI4BsYkeT4yp8tljUwKkANDj79LibjqZTZnxSL687rm7IJgRaqt9y0CZV5-PyU8MwNWvFN26zeE0ajYMBBWbYT2RisLadkw",
    "expirationTime": null,
    "keys": {
        "p256dh": "BAKyD2bk8T+REvHPhBMFMBCUGS2w8TMqlr/q9b7afdaDowWc/AVLfOcJGpaY/KCu++QA1MHPTYXlK8PUYvcgGVY=",
        "auth": "yy7YI1BDjQfubVQguSs6QQ=="
    }
};
const payload = JSON.stringify({
    "title": 'Made for each other | Lovebird Bra Panty Set',
    "body":"Bra Panty Set or Lingerie Set is the perfect combination of both upper and lower part which are made for each other to look perfect.",
    "icon": 'https://www.lovebirdlingerie.com/webstatic/images/logo2.png',
    'tag':'Message2',
    'url':'http://www.lovebirdlingerie.com/collection/minimizer-bras-76/'

});
webpush.sendNotification(pushSubscription,payload);
