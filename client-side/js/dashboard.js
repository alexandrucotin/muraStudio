var dashboard = {
    
    init: function() {
        dashboard.valid_user();
        dashboard.init_news_post();
        dashboard.hide_options();
        dashboard.init_options();
        dashboard.init_state();
        dashboard.init_news_image();
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
    
    hide_options: function() {
        $('.dashboard_option').css('display', 'none');
        $('#landpage_add').css('display', 'block');
    },
    
    init_options: function() {
        $('#landpage_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#landpage_add').css('display', 'block');
        });
        $('#news_post_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#news_post_form').css('display', 'block');
        });
        $('#work_post_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#work_post_form').css('display', 'block');
        });
    },
    
    init_state: function() {
        dashboard.news_image = '';
        dashboard.work_image = '';
    },
    
    init_news_image: function() {
        $('#news_image').change(function(event) {
            var reader = new FileReader();
            reader.onload = function(e) {
                dashboard.news_image = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    },
    
    init_news_post: function() {
        $('#news_submit').on('click', function() {
            var title = $('#news_title').val();
            var description = $('#news_description').val();
            var text = $('#news_text').val();
            var image = dashboard.news_image;
            if (title.length > 0 && description.length > 0 && text.length > 0 && image.length > 0) {
                $.ajax({
                    url: 'post_news',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        title: title,
                        description: description,
                        text: text,
                        image: image
                    }),
                    success: function(response) {
                        $('#news_title, #news_description, #news_text, #news_image').val('');
                        $('#success_message').html('News element posted correctly!');
                        $('#success_modal').modal('show');
                    }
                });
            } else {
                $('#news_title, #news_description, #news_text, #news_image').css('border-color', 'red');
                $('#error_message').html('You must fill every input field!');
                $('#error_modal').modal('show');
            }
        });
    }

};


$(document).ready(dashboard.init());
