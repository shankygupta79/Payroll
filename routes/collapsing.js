$(document).ready(function () {


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #navbar-top').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    
    
});

