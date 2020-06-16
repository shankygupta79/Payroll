const Sequelize = require('sequelize')
const dotenv = require("dotenv")
dotenv.config()
const db = new Sequelize(process.env.DATABASE,process.env.USER ,process.env.PASSWORD , {
    host:process.env.HOST,
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
host='https://payrollv2.herokuapp.com/';
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