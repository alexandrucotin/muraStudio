var home = {
    
    get_images: function() {
        $.ajax({
            url: 'get_landpage_images',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response) {
                response = home.format_images(response);
                $.get('/html/templates.html', function(content) {
                    var template = $(content).filter('#landpage_images').html();
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
    }

};


$(document).ready(home.get_images());
