Vue.component('navbar-component', {
    props: [],
    created: function () {
        this.loadi();
    },
    methods: {
        loadi() {
            console.log(localStorage.getItem('panelTheme'))
            var val = (localStorage.getItem('panelTheme'));
            if (val == 'Theme 1') {
                //Blue
            } else if (val == "Theme 2") {
                //Black
                $(':root').css('--navbar-color', 'black');
                $(':root').css('--body', 'lightgrey');
                $(':root').css('--text-hover', 'rgb(36, 36, 40)');
            } else if (val == "Theme 3") {
                //Red
                $(':root').css('--navbar-color', 'red');
                $(':root').css('--body', 'white');
                $(':root').css('--text-hover', 'rgb(245, 150, 127)');
            } else if (val == "Theme 4") {
                //Green
                $(':root').css('--navbar-color', 'darkgreen');
                $(':root').css('--body', 'white');
                $(':root').css('--text-hover', 'rgb(91, 175, 91)');
            } else if (val == "Theme 5") {
                //Voilet
                $(':root').css('--navbar-color', 'purple');
                $(':root').css('--body', 'white');
                $(':root').css('--text-hover', 'rgb(175, 91, 171)');
            } else if (val == "Theme 6") {
                //Orange
                $(':root').css('--navbar-color', 'orange');
                $(':root').css('--body', 'white');
                $(':root').css('--text-hover', 'rgb(214, 163, 68)');
            } else if (val == "Theme 7") {
                //White
                $(':root').css('--navbar-color', 'rgb(165, 179, 182)');
                $(':root').css('--body', 'white');
                $(':root').css('--text-hover', 'rgb(206, 204, 200)');
            } else if (val == "Theme 8") {
                //Bluesky
                $(':root').css('--navbar-color', 'skyblue');
                $(':root').css('--body', 'white');
                $(':root').css('--text-hover', 'rgb(170, 250, 250)');
            }

            return 0
        }, changecolor: function () {
            console.log("Hi")
            if (localStorage.getItem('panelTheme') == 'Blue') {
                localStorage.setItem('panelTheme', 'Dark');
                window.location.reload();
            } else {
                localStorage.setItem('panelTheme', 'Blue');
                window.location.reload();
            }
        }


    },
    data:
        function () {
            return {
                error: "Err"
            };

        },

    template: `<nav id="sidebar">
    <div class="sidebar-header">
        <h3><img src="../Images/logo" class="logoi" ></h3>
    </div>

    <ul class="list-unstyled components" style="padding:0">
        <p>Welcome</p>
        <li>
            <a href="https://payrollv2.herokuapp.com/dashboard"><i class="fa fa-tachometer" style="color:blue" aria-hidden="true"></i>&nbsp Dashboard</a>
        </li>
        <li >
            <a href="#employee" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-users" aria-hidden="true" style="color:green"></i>&nbsp Employee</a>
            <ul class="collapse list-unstyled" id="employee" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/employee/add_emp"><i class="fa fa-ellipsis-h" style="color:green"aria-hidden="true"></i>&nbsp Add Employee</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/employee/manage_emp"><i class="fa fa-ellipsis-h" style="color:green"aria-hidden="true"></i>&nbsp Manage Employee</a>
                </li>
            </ul>
        </li>
        <li >
            <a href="#department" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-fort-awesome" style="color:yellow" aria-hidden="true"></i>&nbsp Department</a>
            <ul class="collapse list-unstyled" id="department" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/department/add_dep"><i class="fa fa-ellipsis-h" style="color:yellow"aria-hidden="true"></i>&nbsp Add Department</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/department/manage_dep"><i class="fa fa-ellipsis-h" style="color:yellow"aria-hidden="true"></i>&nbsp Show Department</a>
                </li>
            </ul>
        </li>
        <li >
            <a href="#attendance" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-calendar-check-o" style="color:lightgreen" aria-hidden="true"></i>&nbsp Attendace</a>
            <ul class="collapse list-unstyled" id="attendance" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/attendance/daily_attendance"><i class="fa fa-ellipsis-h" style="color:lightgreen"aria-hidden="true"></i>&nbsp Daily Attendance</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/attendance/attendance_report"><i class="fa fa-ellipsis-h" style="color:lightgreen"aria-hidden="true"></i>&nbsp Attendance Report</a>
                </li>
            </ul>
        </li>
        <li >
            <a href="#holiday" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-plane" aria-hidden="true" style="color:rgb(209, 137, 4)"></i>&nbsp Holidays</a>
            <ul class="collapse list-unstyled" id="holiday" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/holiday/add_holiday"><i class="fa fa-ellipsis-h" style="color:rgb(209, 137, 4)"aria-hidden="true"></i>&nbsp Add Holiday</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/holiday/manage_holiday"><i class="fa fa-ellipsis-h" style="color:rgb(209, 137, 4)"aria-hidden="true"></i>&nbsp Manage Holiday</a>
                </li>
            </ul>
        </li>
        <li >
            <a href="#payslip" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-money" aria-hidden="true" style="color:lightblue"></i>&nbsp Salary Ledger</a>
            <ul class="collapse list-unstyled" id="payslip" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/calc"><i class="fa fa-ellipsis-h" style="color:lightblue"aria-hidden="true"></i>&nbsp Salary Calculator</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/list"><i class="fa fa-ellipsis-h" style="color:lightblue"aria-hidden="true"></i>&nbsp Payslip List</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/ledger"><i class="fa fa-ellipsis-h" style="color:lightblue"aria-hidden="true"></i>&nbsp Ledger</a>
                </li>
                
            </ul>
        </li>
        <li >
            <a href="#loan" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-usd" aria-hidden="true" style="color:ivory"></i><i class="fa fa-usd" aria-hidden="true" style="color:ivory"></i>&nbsp Loans & Adv.</a>
            <ul class="collapse list-unstyled" id="loan" data-parent="#sidebar">
                
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/entry"><i class="fa fa-ellipsis-h" style="color:ivory"aria-hidden="true"></i>&nbsp Add or Recieve Loan </a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/entry_adv"><i class="fa fa-ellipsis-h" style="color:ivory"aria-hidden="true"></i>&nbsp Add Advance </a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/loan"><i class="fa fa-ellipsis-h" style="color:ivory"aria-hidden="true"></i>&nbsp View Total Loans </a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/payslips/adv"><i class="fa fa-ellipsis-h" style="color:ivory"aria-hidden="true"></i>&nbsp View Total Adv. </a>
                </li>
                
            </ul>
        </li>
        <li >
            <a href="#setting" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-cogs" aria-hidden="true" style="color:rgb(196, 5, 5)"></i>&nbsp Settings</a>
            <ul class="collapse list-unstyled" id="setting" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/settings/change_password"><i class="fa fa-ellipsis-h" style="color:rgb(196, 5, 5)"aria-hidden="true"></i>&nbsp Change Password</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/settings/configrations"><i class="fa fa-ellipsis-h" style="color:rgb(196, 5, 5)"aria-hidden="true"></i>&nbsp Configurations</a>
                </li>
            </ul>
        </li>
        <li >
            <a href="#user" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
            <i class="fa fa-user" aria-hidden="true" style="color:coral"></i>&nbsp Users</a>
            <ul class="collapse list-unstyled" id="user" data-parent="#sidebar">
                <li>
                    <a href="https://payrollv2.herokuapp.com/users/add_user"><i class="fa fa-ellipsis-h" style="color:coral"aria-hidden="true"></i>&nbsp Add User</a>
                </li>
                <li>
                    <a href="https://payrollv2.herokuapp.com/users/manage_user"><i class="fa fa-ellipsis-h" style="color:coral"aria-hidden="true"></i>&nbsp Manage User</a>
                </li>
            </ul>
        </li>
        
        
        
        <li>
            <a href="https://payrollv2.herokuapp.com/auth/logout"><i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp Logout</a>
        </li>
    </ul>

</nav>
`
    ,

});
Vue.component('navbar-top', {
    props: [],
    created: function () {

    },
    methods: {

    },
    data:
        function () {
            return {
                error: "Err",

            };

        },

    template: `<div class="navbarr">
                
    <button type="button" id="sidebarCollapse" >
        <i class="fa fa-bars"></i>
    </button>
    
    
    <div class="dropdown2" >
      <button class="dropbtn"><i class="fa fa-user-circle-o" aria-hidden="true" style="color:orange"></i>&nbsp 
      Administrator 
        <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown2-content">
            <a href="https://payrollv2.herokuapp.com/settings/profile" >Profile</a>
            <a href="https://payrollv2.herokuapp.com/settings/change_password" class="hov">Change Password</a>
            <a href="https://payrollv2.herokuapp.com/settings/configrations" class="hov">Configrations</a>
            <a href="https://payrollv2.herokuapp.com/auth/logout" class="hov">Logout &nbsp<i class="fa fa-sign-out" aria-hidden="true"></i> </a>
          </div>
    </div>
    </div>
    
  `
    ,
});
