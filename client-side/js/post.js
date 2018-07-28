var post = {
    
    init: function() {
        post.get_element_id();
        post.get_images();
        post.get_element();
    },
    
    get_element_id: function() {
        var address = decodeURIComponent(window.location.search.substring(1));
        var variables = address.split('&');
        var i, current;
        for (i = 0; i < variables.length; i++) {
            current = variables[i].split('=');
            if (current[0] === 'id') {
                post.element_id = current[1] === undefined ? true : current[1];
            }
        }
    },
    
    get_images: function() {
        $.ajax({
            url: 'get_work_images',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({work_id: post.element_id}),
            success: function(response) {
                response = post.format_images(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#work_images').html();
                    $('#carousel').html(Mustache.render(template, response));
                    $('.carousel-item:first').addClass('active');
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
                    n: i,
                    location: current[1]
                };
            }
            response.images = new_list;
            return response;
        }
        return [];
    },
    
    get_element: function() {
        $.ajax({
            url: 'get_work_element',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({id: post.element_id}),
            success: function(response) {
                $('.full-width-image-2').css('background-image', 'url(' + response.work_element[3] + ')');
                response = post.format_element(response);
                $('title').html(response.work_element.title + ' - Mura Studio');
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_work_element').html();
                    $('#work_element').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_element: function(response) {
        var work_element = response.work_element;
        if(work_element) {
            var i, current, title, date, text, image;
            var new_element = {
                title: work_element[0],
                date: post.format_date(work_element[1]),
                text: post.format_text(work_element[2])
            };
            response.work_element = new_element;
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
    
    format_text: function(text) {
        var md = window.markdownit();
        var html_text = md.render(text);
        return html_text;
    }

};


$(document).ready(post.init());
