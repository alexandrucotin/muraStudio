var news = {
    
    get_news: function() {
        $.ajax({
            url: 'get_news',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                response = news.format_news(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_news').html();
                    $('#news').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_news: function(response) {
        var news = response.news;
        if(news) {
            var new_list = [];
            var i, current, post_id, title, date, description, text, image;
            for (i = 0; i < news.length; i++) {
                current = news[i];
                new_list[i] = {
                    post_id: current[0],
                    title: current[1],
                    date: news.format_date(current[2]),
                    description: current[3],
                    text: current[4],
                    image: current[5]
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
        var new_date = date[2] + ' ' + months[date[1] - 1] + '/' + date[0];
        return new_date;
    }

};


$(document).ready(news.get_news());
