$(function() {
    $('a[href*=\\#section]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });

    $('#password, #confirm-password').on('keyup', function () {
        var confirm_password = document.getElementById("confirm-password");
        if ($('#password').val() == $('#confirm-password').val()) {
            confirm_password.setCustomValidity("");
        } else {
            confirm_password.setCustomValidity("Passwords Don't Match");
        }
    });
});