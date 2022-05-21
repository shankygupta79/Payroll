const Sequelize = require('sequelize')
const dotenv = require("dotenv")
dotenv.config()
const db = new Sequelize(process.env.DATABASE, process.env.USERR, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres',
    port: 5432,
    operatorsAliases: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    },
    pool: {
        max: 8,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
var config = {
    "define": {
        "createdAt": "createdat",
        "updatedAt": "updatedat"
    } /*don't forget to add host, port, dialect, etc.*/
}
const User = db.define('user_local', {
    userid: {
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
    }, emailid: {
        type: Sequelize.STRING,
        allowNULL: false
    }
    , authenticationtype: {
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
    }, authenticationtype: {
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
    expotoken: Sequelize.STRING,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },
})
const Employeedb = db.define('employee', {
    emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: Sequelize.INTEGER,
    fname: Sequelize.STRING,
    mname: Sequelize.STRING,
    gender: Sequelize.STRING,
    dob: Sequelize.STRING,
    aadhaar: Sequelize.STRING,
    pan: Sequelize.STRING,
    fnum: Sequelize.STRING,
    mnum: Sequelize.STRING,
    anum: Sequelize.STRING,
    add1: Sequelize.STRING,
    add2: Sequelize.STRING,
    land: Sequelize.STRING,
    bname: Sequelize.STRING,
    ifsc: Sequelize.STRING,
    accnum: Sequelize.STRING,
    accname: Sequelize.STRING,
    branch: Sequelize.STRING,
    doc1: Sequelize.STRING,
    doc2: Sequelize.STRING,
    doc3: Sequelize.STRING,
    doc4: Sequelize.STRING,
    doc5: Sequelize.STRING,
})
const Attendance = db.define('attendance', {
    userid: Sequelize.INTEGER,
    emp_id: Sequelize.INTEGER,
    monthyear: Sequelize.STRING,
    present: Sequelize.STRING,
    marked: Sequelize.STRING,
    quick: Sequelize.STRING,
    holidays: Sequelize.INTEGER,
    extratimetotoal: Sequelize.INTEGER,
    extratime: Sequelize.STRING,
    advance: Sequelize.INTEGER,
    bonus: Sequelize.INTEGER,
    deduction: Sequelize.INTEGER,
    balance: Sequelize.INTEGER,
    transfer: Sequelize.INTEGER,
    attby: Sequelize.STRING,
    text: Sequelize.STRING,
    netpay: Sequelize.INTEGER,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },
    emi: Sequelize.INTEGER,

})
const Employeeqdb = db.define('employee_quick', {
    emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: Sequelize.INTEGER,
    name: Sequelize.STRING,
    doj: Sequelize.STRING,
    des: Sequelize.STRING,
    dep: Sequelize.STRING,
    email: Sequelize.STRING,
    pnum: Sequelize.STRING,
    photo: Sequelize.STRING,
    salary: Sequelize.STRING,
    status: Sequelize.STRING,
    totalloan: Sequelize.INTEGER,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },

})
const Department = db.define('department', {
    dep_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: Sequelize.INTEGER,
    depname: Sequelize.STRING,
    depcount: Sequelize.INTEGER,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },

})
const Holiday = db.define('holiday', {
    hol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: Sequelize.INTEGER,
    holname: Sequelize.STRING,
    year: Sequelize.INTEGER,
    date: Sequelize.STRING,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },

})
const Setting = db.define('setting', {
    userid: Sequelize.INTEGER,
    name: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    website: Sequelize.STRING,
    add: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },

})
const Loan = db.define('loan', {
    userid: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
    amount: Sequelize.INTEGER,
    text: Sequelize.STRING,
    emp_id: Sequelize.INTEGER,
    date: Sequelize.STRING,
    createdAt: {
        type: Sequelize.DATE,
        field: 'createdat'
    },
    
    updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedat'
    },
})
const Adv = db.define('Adv', {
    userid: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
    amount: Sequelize.INTEGER,
    text: Sequelize.STRING,
    emp_id: Sequelize.INTEGER,
    date: Sequelize.STRING,
    monthyear: Sequelize.STRING,
})
db.sync()
    .then(() => console.log("Database has been synced"))
    .catch((err) => console.error("Error creating database " + err))
exports = module.exports = {
    User, Employeeqdb, Employeedb, Holiday, Department, Setting, Attendance, Loan, Adv
}