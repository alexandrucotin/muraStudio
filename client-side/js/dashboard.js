var dashboard = {
    
    init: function() {
        dashboard.valid_user();
    },
    
    valid_user: function() {
        var username = sessionStorage.getItem('username');
        var password = sessionStorage.getItem('password');
        if (username && password) {
            $.ajax({
                url: 'valid_user',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                success: function(response) {
                    if (!response.valid_user) {
                        window.location.href = '/login';
                    }
                }
            });
        } else window.location.href = '/login';
    }

};


$(document).ready(dashboard.init());
