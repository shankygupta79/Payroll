$(document).ready(function () {

    axios.get('http://localhost:3420/dashboard/logo')
        .then(function (Response1) {
            console.log(Response1)
            $('.logoi').attr("src", Response1);
        })
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #navbar-top,#content2').toggleClass('active');
        if ($(window).width() < 814) {
            $('body').css("background-color", "rgb(168, 156, 156)");
        }
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('#content2').on('click', function () {
        var boolea = $('#content2').hasClass('active');
        if ($(window).width() < 814 && boolea) {
            $('body').css("background-color", "white");
            $('#sidebar, #navbar-top,#content2').toggleClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        }

    });
});

