var login = {
    
    init_login: function() {
        $('#login_button').on('click', login.login);
        $('#username, #password').on('keyup', function(e) {
            if (e.keyCode == 13) {
                login.login();
            }
        });
    },
    
    login: function() {
        var username = $('#username').val().toLowerCase();
        var plain_password = $('#password').val();
        if (username.length > 0 && plain_password.length > 0) {
            var password = SHA256(plain_password);
            login.login_request(username, password);
        } else {
            $('#username, #password').css('border-color', 'red');
            $('#error_modal').modal('show');
        }
    },
    
    login_request: function(username, password) {
        $.ajax({
            url: 'user_login',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function(response) {
                if (response.valid_user) {
                    sessionStorage.clear();
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('password', password);
                    window.location.href = '/dashboard';
                } else {
                    $('#password').val('');
                    $('#username, #password').css('border-color', 'red');
                    $('#error_modal').modal('show');
                }
            }
        });
    }

};


$(document).ready(login.init_login());
