const Sequelize = require('sequelize')
const dotenv = require("dotenv")
dotenv.config()
const db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: 3306,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
const User = db.define('User_local', {
    userId: {
        type: Sequelize.STRING,
        allowNULL: true
    },
    username: {
        type: Sequelize.STRING,
        allowNULL: true
    },
    thumbnail: {
        type: Sequelize.STRING,
        allowNULL: true
    }, emailId: {
        type: Sequelize.STRING,
        allowNULL: false
    }
    , authenticationType: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
        allowNULL: true
    }, fullname: {
        type: Sequelize.STRING,
        allowNULL: false
    }, salt: {
        type: Sequelize.STRING
    }, authenticationType: {
        type: Sequelize.STRING
    }, valid: {
        type: Sequelize.STRING
    }, password: {
        type: Sequelize.STRING
    }, admin: Sequelize.INTEGER,
    access: Sequelize.STRING,
    currency: Sequelize.STRING,
    office_close: Sequelize.STRING,
    logo: Sequelize.STRING,
})
const Employeedb = db.define('employee', {
    emp_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
    },
    userId:Sequelize.INTEGER,
    fname:Sequelize.STRING,
    mname:Sequelize.STRING,
    gender:Sequelize.STRING,
    dob:Sequelize.STRING,
    aadhaar:Sequelize.STRING,
    pan:Sequelize.STRING,
    fnum:Sequelize.STRING,
    mnum:Sequelize.STRING,
    anum:Sequelize.STRING,
    add1: Sequelize.STRING,
    add2: Sequelize.STRING,
    land:Sequelize.STRING,
    salary: Sequelize.STRING,
    bname: Sequelize.STRING,
    ifsc: Sequelize.STRING,
    accnum: Sequelize.STRING,  
    accname: Sequelize.STRING,
    branch: Sequelize.STRING,
    status: Sequelize.STRING,
    photo:Sequelize.STRING,
    doc1:Sequelize.STRING,
    doc2:Sequelize.STRING,
    doc3:Sequelize.STRING,
    doc4:Sequelize.STRING,
    doc5:Sequelize.STRING,
})
const Employeeqdb = db.define('employee_quick', {
    emp_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
    },
    userId:Sequelize.INTEGER,
    name:Sequelize.STRING,
    doj:Sequelize.STRING,
    des:Sequelize.STRING,
    dep:Sequelize.STRING,
    email:Sequelize.STRING,
    pnum:Sequelize.STRING,
    
})
const Department = db.define('department', {
    dep_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
    },
    userId:Sequelize.INTEGER,
    depname:Sequelize.STRING,
    depcount:Sequelize.INTEGER,
    
})
const Holiday = db.define('holiday', {
    hol_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
    },
    userId:Sequelize.INTEGER,
    holname:Sequelize.STRING,
    year:Sequelize.INTEGER,
    
})

db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error creating database " + err))
exports = module.exports = {
    User,Employeeqdb,Employeedb,Holiday,Department
}