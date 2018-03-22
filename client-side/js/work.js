var work = {
    
    get_work: function() {
        $.ajax({
            url: 'get_work',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                response = work.format_work(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#get_work').html();
                    $('#work').html(Mustache.render(template, response));
                });
            }
        });
    },
    
    format_work: function(response) {
        var work_list = response.work;
        if(work_list) {
            var new_list = [];
            var i, current, post_id, title, date, description, text, image;
            for (i = 0; i < work_list.length; i++) {
                current = work_list[i];
                new_list[i] = {
                    post_id: current[0],
                    title: current[1],
                    date: work.format_date(current[2]),
                    description: current[3],
                    text: current[4],
                    image: current[5]
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
    }

};


$(document).ready(work.get_work());
