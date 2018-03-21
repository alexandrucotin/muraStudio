var post_news = {
    
    init: function() {
        post_news.get_element_id();
        post_news.get_element();
    },
    
    get_element_id: function() {
        var address = decodeURIComponent(window.location.search.substring(1));
        var variables = address.split('&');
        var i, current;
        for (i = 0; i < variables.length; i++) {
            current = variables[i].split('=');
            if (current[0] === 'id') {
                post_news.element_id = current[1] === undefined ? true : current[1];
            }
        }
    },
    
    get_element: function() {
        $.ajax({
            url: 'get_news_element',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({id: post_news.element_id}),
            success: function(response) {
                response = post_news.format_element(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_news_element').html();
                    $('#post_news_element').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_element: function(response) {
        var news_post = response.news_post;
        if(news_post) {
            var new_element = [];
            var i, current, title, date, description, text, image;
            for (i = 0; i < news_post.length; i++) {
                current = news_post[i];
                new_element[i] = {
                    title: current[0],
                    date: post_news.format_date(current[1]),
                    description: current[2],
                    text: current[3],
                    image: current[4]
                };
            }
            response.news_post = new_element;
            return response;
        }
        return [];
    },
    
    format_date: function(date) {
        var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        date = date.split(' ')[0].split('-');
        var new_date = date[2] + ' ' + months[date[1] - 1] + ' ' + date[0];
        return new_date;
    }

};


$(document).ready(post_news.init());
