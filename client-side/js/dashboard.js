var dashboard = {
    
    init: function() {
        dashboard.valid_user();
        dashboard.init_state();
        dashboard.init_news_post();
    },
    
    init_state: function() {
        dashboard.news_image = '';
        dashboard.work_image = '';
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
    },
    
    init_news_image: function() {
        $('#news_image').change(function(e) {
            var reader = new FileReader();
            reader.onload = function(e) {
                dashboard.news_image = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    },
    
    init_news_post: function() {
        $('#news_post').on('click', function() {
            var title = $('#news_title').val();
            var description = $('#news_description').val();
            var text = $('#news_text').val();
            var image = dashboard.news_image;
            if (title.length > 0 && description.length > 0 && text.length > 0 && image.length > 0) {
                
            } else {
                // TODO: error modal display
            }
        });
    }

};


$(document).ready(dashboard.init());
