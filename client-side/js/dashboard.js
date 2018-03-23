var dashboard = {
    
    init: function() {
        dashboard.init_state();
        dashboard.hide_options();
        dashboard.valid_user();
        dashboard.get_landpage_images();
        dashboard.get_work_list();
        dashboard.init_options();
        dashboard.init_landpage_image();
        dashboard.init_landpage_add();
        dashboard.init_preview_image();
        dashboard.init_work_image();
        dashboard.init_work_add();
        dashboard.init_work_post();
        dashboard.init_password();
        dashboard.init_logout();
    },
    
    init_state: function() {
        dashboard.landpage_image = '';
        dashboard.preview_image = '';
        dashboard.work_image = '';
        dashboard.current_work = '';
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
    
    get_landpage_images: function() {
        $.ajax({
            url: 'get_landpage_images',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                response = dashboard.format_images(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_landpage_images').html();
                    $('#landpage_images').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_images: function(response) {
        var images_list = response.images;
        if(images_list) {
            var new_list = [];
            var i, current;
            for (i = 0; i < images_list.length; i++) {
                current = images_list[i];
                new_list[i] = {
                    id: current[0],
                    location: current[1]
                };
            }
            response.images = new_list;
            return response;
        }
        return [];
    },
    
    init_landpage_image: function() {
        $('#landpage_image').change(function(event) {
            var reader = new FileReader();
            reader.onload = function(e) {
                dashboard.landpage_image = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    },
    
    init_landpage_add: function() {
        $('#landpage_submit').on('click', function() {
            $('#landpage_image').css('border-color', '#ccc');
            var image = dashboard.landpage_image;
            if (image.length > 0) {
                dashboard.landpage_add_request(image);
            } else {
                $('#landpage_image').css('border-color', 'red');
                $('#error_message').html('You must select an image!');
                $('#error_modal').modal('show');
            }
        });
    },
    
    landpage_add_request: function(image) {
        $.ajax({
            url: 'add_landpage_image',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                username: dashboard.username,
                password: dashboard.password,
                image: image
            }),
            success: function(response) {
                if (response.user_not_valid) {
                    window.location.href = '/login';
                } else {
                    dashboard.get_landpage_images();
                    dashboard.landpage_image = '';
                    $('#landpage_image').val('');
                    $('#landpage_image').css('border-color', '#ccc');
                    $('#success_message').html('New landpage image uploaded correctly!');
                    $('#success_modal').modal('show');
                }
            }
        });
    },
    
    delete_landpage_image: function(image_id) {
        $('#confirm_modal').modal('show');
        $('#confirm_delete').on('click', function() {
            $.ajax({
                url: 'delete_landpage_image',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    username: dashboard.username,
                    password: dashboard.password,
                    image_id: image_id
                }),
                success: function(response) {
                    if (response.user_not_valid) {
                        window.location.href = '/login';
                    } else {
                        dashboard.get_landpage_images();
                        $('#success_message').html('Landpage image deleted correctly!');
                        $('#success_modal').modal('show');
                    }
                }
            });
        });
    },
    
    get_work_list: function() {
        $.ajax({
            url: 'get_work_list',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                response = dashboard.format_work(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_work_list').html();
                    $('#work_list').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_work: function(response) {
        var work_list = response.work;
        if(work_list) {
            var new_list = [];
            var i, current, post_id, title, date;
            for (i = 0; i < work_list.length; i++) {
                current = work_list[i];
                new_list[i] = {
                    post_id: current[0],
                    title: current[1],
                    date: dashboard.format_date(current[2])
                };
            }
            response.work = new_list;
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
        $('#work_post_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#work_post_form').css('display', 'block');
        });
        $('#work_list_option').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#work_post_list').css('display', 'block');
        });
        $('#change_password').on('click', function() {
            $('.dashboard_option').css('display', 'none');
            $('#password_form').css('display', 'block');
        });
    },
    
    init_preview_image: function() {
        $('#preview_image').change(function(event) {
            var reader = new FileReader();
            reader.onload = function(e) {
                dashboard.preview_image = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    },
    
    init_work_post: function() {
        $('#work_submit').on('click', function() {
            dashboard.work_post();
        });
        $('#work_title, #work_description').on('keyup', function(e) {
            if (e.keyCode == 13) {
                dashboard.work_post();
            }
        });
    },
    
    work_post: function() {
        $('#work_title, #work_description, #work_text, #preview_image').css('border-color', '#ccc');
        var title = $('#work_title').val();
        var description = $('#work_description').val();
        var text = $('#work_text').val();
        var image = dashboard.preview_image;
        if (title.length > 0 && description.length > 0 && text.length > 0 && image.length > 0) {
            dashboard.work_post_request(title, description, text, image);
        } else {
            $('#work_title, #work_description, #work_text, #preview_image').css('border-color', 'red');
            $('#error_message').html('You must fill every input field!');
            $('#error_modal').modal('show');
        }
    },
    
    work_post_request: function(title, description, text, image) {
        $.ajax({
            url: 'post_work',
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
                if (response.user_not_valid) {
                    window.location.href = '/login';
                } else {
                    dashboard.get_work_list();
                    dashboard.get_work_images();
                    dashboard.current_work = response.work_id;
                    dashboard.preview_image = '';
                    $('#work_title, #work_description, #work_text, #preview_image').val('');
                    $('#work_title, #work_description, #work_text, #preview_image').css('border-color', '#ccc');
                    $('#success_message').html('Work element posted correctly!');
                    $('#success_modal').modal('show');
                    $('#work_title_value').html(title);
                    $('.dashboard_option').css('display', 'none');
                    $('#work_images_form').css('display', 'block');
                }
            }
        });
    },
    
    get_work_images: function() {
        $.ajax({
            url: 'get_work_images',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                work_id: dashboard.current_work
            }),
            success: function(response) {
                response = dashboard.format_images(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_work_images').html();
                    $('#work_images').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    init_work_image: function() {
        $('#work_image').change(function(event) {
            var reader = new FileReader();
            reader.onload = function(e) {
                dashboard.work_image = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        });
    },
    
    init_work_add: function() {
        $('#work_image_submit').on('click', function() {
            $('#work_image').css('border-color', '#ccc');
            var image = dashboard.work_image;
            if (image.length > 0) {
                dashboard.work_add_request(image);
            } else {
                $('#work_image').css('border-color', 'red');
                $('#error_message').html('You must select an image!');
                $('#error_modal').modal('show');
            }
        });
    },
    
    work_add_request: function(image) {
        $.ajax({
            url: 'add_work_image',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                username: dashboard.username,
                password: dashboard.password,
                image: image,
                work_id: dashboard.current_work
            }),
            success: function(response) {
                if (response.user_not_valid) {
                    window.location.href = '/login';
                } else {
                    dashboard.get_work_images();
                    dashboard.work_image = '';
                    $('#work_image').val('');
                    $('#work_image').css('border-color', '#ccc');
                    $('#success_message').html('New image uploaded correctly!');
                    $('#success_modal').modal('show');
                }
            }
        });
    },
    
    delete_work_image: function(image_id) {
        $('#confirm_modal').modal('show');
        $('#confirm_delete').on('click', function() {
            $.ajax({
                url: 'delete_work_image',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    username: dashboard.username,
                    password: dashboard.password,
                    image_id: image_id
                }),
                success: function(response) {
                    if (response.user_not_valid) {
                        window.location.href = '/login';
                    } else {
                        dashboard.get_landpage_images();
                        $('#success_message').html('Image deleted correctly!');
                        $('#success_modal').modal('show');
                    }
                }
            });
        });
    },
    
    modify_work_element: function(post_id) {
        $.ajax({
            url: 'get_work_element',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({id: post_id}),
            success: function(response) {
                if (response.user_not_valid) {
                    window.location.href = '/login';
                } else {
                    var element = response.work_element;
                    $('#work_modify_title').val(element[0]);
                    $('#work_modify_description').val(element[2]);
                    $('#work_modify_text').val(element[3]);
                    $('.dashboard_option').css('display', 'none');
                    $('#work_modify_form').css('display', 'block');
                    $('#work_modify_submit').on('click', function() {
                        $('#work_modify_title, #work_modify_description, #work_modify_text').css('border-color', '#ccc');
                        var title = $('#work_modify_title').val();
                        var description = $('#work_modify_description').val();
                        var text = $('#work_modify_text').val();
                        if (title.length > 0 && description.length > 0 && text.length > 0) {
                            dashboard.work_modify_request(post_id, title, description, text);
                        } else {
                            $('#work_modify_title, #work_modify_description, #work_modify_text').css('border-color', 'red');
                            $('#error_message').html('You must fill every input field!');
                            $('#error_modal').modal('show');
                        }
                    });
                }
            }
        });
    },
    
    work_modify_request: function(id, title, description, text, image) {
        $.ajax({
            url: 'modify_work_element',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                username: dashboard.username,
                password: dashboard.password,
                id: id,
                title: title,
                description: description,
                text: text,
                image: image
            }),
            success: function(response) {
                if (response.user_not_valid) {
                    window.location.href = '/login';
                } else {
                    dashboard.current_work = id;
                    dashboard.get_work_images();
                    dashboard.get_work_list();
                    $('#work_modify_title, #work_modify_description, #work_modify_text').val('');
                    $('#work_modify_title, #work_modify_description, #work_modify_text').css('border-color', '#ccc');
                    $('#success_message').html('Work element modified correctly!');
                    $('#success_modal').modal('show');
                    $('#work_title_value').html(title);
                    $('.dashboard_option').css('display', 'none');
                    $('#work_images_form').css('display', 'block');
                }
            }
        });
    },
    
    delete_work_element: function(post_id, title) {
        $('#post_title').html(title);
        $('#confirm_modal').modal('show');
        $('#confirm_delete').on('click', function() {
            $.ajax({
                url: 'delete_work_post',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    username: dashboard.username,
                    password: dashboard.password,
                    id: post_id
                }),
                success: function(response) {
                    if (response.user_not_valid) {
                        window.location.href = '/login';
                    } else {
                        dashboard.get_work_list();
                        $('#success_message').html('Work element deleted correctly!');
                        $('#success_modal').modal('show');
                    }
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
                dashboard.password_change_request(old_pwd, new_pwd);
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
    },
    
    password_change_request: function(old_pwd, new_pwd) {
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
                    $('#success_message').html('New password set correctly!');
                    $('#success_modal').modal('show');
                    sessionStorage.setItem('password', new_pwd);
                }
            }
        });
    },
    
    init_logout: function() {
        $('#logout').on('click', function() {
            sessionStorage.clear();
            window.location.href = '/home';
        });
    }

};


$(document).ready(dashboard.init());
