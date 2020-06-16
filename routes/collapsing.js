$(document).ready(function () {


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #navbar-top,#content2').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('.center').on('click', function () {
        if ($(window).width() < 814) {
            $('#sidebar, #navbar-top,#content2').toggleClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
         }
        
    });
    
    
    
});

