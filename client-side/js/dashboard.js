var dashboard = {
    
    init: function() {
        dashboard.hide_options();
        dashboard.valid_user();
        dashboard.get_news_list();
        dashboard.init_options();
        dashboard.init_news_post();
        dashboard.init_state();
        dashboard.init_news_image();
        dashboard.init_password();
    },
    
    hide_options: function() {
        $('.dashboard_option').css('display', 'none');
        $('#landpage_add').css('display', 'block');
    },
    
    valid_user: function() {
        dashboard.username = sessionStorage.getItem('username');
        dashboard.password = sessionStorage.getItem('password');
        if (dashboard.username && dashboard.password) {
            $.ajax({
                url: 'valid_user',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    username: dashboard.username,
                    password: dashboard.password
                }),
                success: function(response) {
                    if (!response.valid_user) {
                        window.location.href = '/login';
                    }
                }
            });
        } else window.location.href = '/login';
    },
    
    get_news_list: function() {
        $.ajax({
            url: 'get_news_list',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                response = dashboard.format_news(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_news_list').html();
                    $('#news_list').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_news: function(response) {
        var news_list = response.news;
        if(news_list) {
            var new_list = [];
            var i, current, post_id, title, date;
            for (i = 0; i < news_list.length; i++) {
                current = news_list[i];
                new_list[i] = {
                    post_id: current[0],
                    title: current[1],
                    date: dashboard.format_date(current[2])
                };
            }
            response.news = new_list;
            return response;
        }
        return [];
    },
    
    format_date: function(date) {
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        date = date.split(' ')[0].split('-');
        var new_date = date[2] + ' ' + months[date[1] - 1] + ' ' + date[0];
        return new_date;
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
        $('#news_list_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#news_post_list').css('display', 'block');
        });
        $('#work_post_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#work_post_form').css('display', 'block');
        });
        $('#change_password').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#password_form').css('display', 'block');
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
            dashboard.news_post();
        });
        $('#news_title, #news_description').on('keyup', function(e) {
            if (e.keyCode == 13) {
                dashboard.news_post();
            }
        });
    },
    
    news_post: function() {
        $('#news_title, #news_description, #news_text, #news_image').css('border-color', '#ccc');
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
                    username: dashboard.username,
                    password: dashboard.password,
                    title: title,
                    description: description,
                    text: text,
                    image: image
                }),
                success: function(response) {
                    $('#news_title, #news_description, #news_text, #news_image').val('');
                    $('#news_title, #news_description, #news_text, #news_image').css('border-color', '#ccc');
                    $('#success_message').html('News element posted correctly!');
                    $('#success_modal').modal('show');
                }
            });
        } else {
            $('#news_title, #news_description, #news_text, #news_image').css('border-color', 'red');
            $('#error_message').html('You must fill every input field!');
            $('#error_modal').modal('show');
        }
    },
    
    delete_news_post: function(post_id, title) {
        dashboard.news_post_to_delete = post_id;
        $('#post_title').html(title);
        $('#confirm_modal').modal('show');
        $('#confirm_delete').on('click', function() {
            $.ajax({
                url: 'delete_news_post',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    username: dashboard.username,
                    password: dashboard.password,
                    id: post_id
                }),
                success: function(response) {
                    $('#success_message').html('News element deleted correctly!');
                    $('#success_modal').modal('show');
                    dashboard.get_news_list();
                }
            });
        });
    },
    
    init_password: function() {
        $('#password_submit').on('click', function() {
            dashboard.change_password();
        });
        $('#old_pwd, #new_pwd, #confirm_pwd').on('keyup', function(e) {
            if (e.keyCode == 13) {
                dashboard.change_password();
            }
        });
    },
    
    change_password: function() {
        $('#old_pwd, #new_pwd, #confirm_pwd').css('border-color', '#ccc');
        var old_pwd = $('#old_pwd').val();
        var new_pwd = $('#new_pwd').val();
        var confirm_pwd = $('#confirm_pwd').val();
        if (old_pwd.length > 0 && new_pwd.length > 0 && confirm_pwd.length > 0) {
            if (new_pwd === confirm_pwd) {
                old_pwd = SHA256(old_pwd);
                new_pwd = SHA256(new_pwd);
                $.ajax({
                    url: 'change_password',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        username: dashboard.username,
                        password: old_pwd,
                        new_password: new_pwd
                    }),
                    success: function(response) {
                        if (response.user_not_valid) {
                            $('#old_pwd').css('border-color', 'red');
                            $('#error_message').html('Old password not correct!');
                            $('#error_modal').modal('show');
                        } else {
                            $('#old_pwd, #new_pwd, #confirm_pwd').val('');
                            $('#old_pwd, #new_pwd, #confirm_pwd').css('border-color', '#ccc');
                            $('#success_message').html('News password set correctly!');
                            $('#success_modal').modal('show');
                            sessionStorage.setItem('password', new_pwd);
                        }
                    }
                });
            } else {
                $('#new_pwd, #confirm_pwd').css('border-color', 'red');
                $('#error_message').html('New passwords not matching!');
                $('#error_modal').modal('show');
            }
        } else {
            $('#old_pwd, #new_pwd, #confirm_pwd').css('border-color', 'red');
            $('#error_message').html('You must fill every input field!');
            $('#error_modal').modal('show');
        }
    }

};


$(document).ready(dashboard.init());
