$(document).ready(function () {


    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #navbar-top,#content2').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('.center').on('click', function () {
        var boolea = $('#content2').hasClass('active');
        if ($(window).width() < 814 && boolea) {
            $('#sidebar, #navbar-top,#content2').toggleClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
         }
        
    });
    
    
    
});

