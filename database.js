const Sequelize = require('sequelize')
const keys = require('./config/keys')
const db = new Sequelize(keys.mysql.DATABASE,keys.mysql.USER ,keys.mysql.PASSWORD , {
    host:keys.mysql.HOST,
    dialect: 'mysql',
    port:3306,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
host='http://localhost:3420/';
const User = db.define('User_local',{
    userId:{
        type: Sequelize.STRING,
        allowNULL:true
    },
    username: {
        type:Sequelize.STRING,
        allowNULL:true
    },
    thumbnail: {
        type: Sequelize.STRING,
        allowNULL:true
    },emailId:{
        type:Sequelize.STRING,
        allowNULL:false
    }
    ,authenticationType:{
        type:Sequelize.STRING
    },
    password:{
        type:Sequelize.STRING,
        allowNULL:true
    },fullname:{
        type:Sequelize.STRING,
        allowNULL:false
    },salt:{
        type:Sequelize.STRING
    },authenticationType:{
        type:Sequelize.STRING
    },valid:{
        type:Sequelize.STRING
    },password:{
        type:Sequelize.STRING
    }

})

db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error creating database "+err))
exports = module.exports = {
    User,host
    }