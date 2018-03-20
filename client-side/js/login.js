$(document).ready(function() {
    
    $('#login_button').on('click', function() {
        var username = $('#username').val()
        var plain_password = $('#password').val()
        if (username.length > 0 && plain_password.length > 0) {
            //var password = SHA256(plain_password);
            var password = plain_password;
            var request = {
                username: username,
                password: password
            };
            $.ajax({
                url: 'user_login',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(request),
                success: function(response) {
                    if (response.valid_user) {
                        sessionStorage.clear();
                        sessionStorage.setItem('username', username.toLowerCase());
                        sessionStorage.setItem('password', password);
                        window.location.href = '/dashboard';
                    } else {
                        $('#password').val('');
                        $('#username, #password').css('border-color', 'red');
                        $('#error_modal').modal('show');
                        //$('#error_modal').css('display', 'block');
                    }
                }
            });
        } else {
            $('#username, #password').css('border-color', 'red');
            $('#error_modal').modal('show');
        }
    });
    
    $('#close_modal').on('click', function() {
        $('#error_modal').css('display', 'none');
    });
    
});
