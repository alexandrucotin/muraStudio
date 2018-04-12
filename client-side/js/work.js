var work = {
    
    init: function() {
        work.init_category();
        work.get_work();
        $('.category_option').css('font-weight', 'normal');
        $('#category_all').css('font-weight', 'bold');
    },
    
    init_category: function() {
        $('#category_all').on('click', function() {
            $('.category_option').css('font-weight', 'normal');
            $('#category_all').css('font-weight', 'bold');
            work.shuffle.filter();
        });
        $('#category_interiors').on('click', function() {
            $('.category_option').css('font-weight', 'normal');
            $('#category_interiors').css('font-weight', 'bold');
            work.shuffle.filter('interiors');
        });
        $('#category_architecture').on('click', function() {
            $('.category_option').css('font-weight', 'normal');
            $('#category_architecture').css('font-weight', 'bold');
            work.shuffle.filter('architecture');
        });
        $('#category_retail').on('click', function() {
            $('.category_option').css('font-weight', 'normal');
            $('#category_retail').css('font-weight', 'bold');
            work.shuffle.filter('retail');
        });
        $('#category_commercial').on('click', function() {
            $('.category_option').css('font-weight', 'normal');
            $('#category_commercial').css('font-weight', 'bold');
            work.shuffle.filter('commercial');
        });
    },
    
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
                    setTimeout(function() {
                        work.shuffle = new Shuffle($('#work'), {itemSelector: '.all', sizer: '#work'});
                        work.shuffle.options.speed = 750;
                    }, 1000);
                });
            }
        });
    },
    
    format_work: function(response) {
        var work_list = response.work;
        if(work_list) {
            var new_list = [];
            var i, current, post_id, title, date, text, image;
            for (i = 0; i < work_list.length; i++) {
                current = work_list[i];
                new_list[i] = {
                    post_id: current[0],
                    title: current[1],
                    year: work.get_year(current[2]),
                    groups: work.get_groups(
                        current[3],
                        current[4],
                        current[5],
                        current[6]
                    ),
                    categories: work.get_categories(
                        current[3],
                        current[4],
                        current[5],
                        current[6]
                    ),
                    image: current[7]
                };
            }
            response.work = new_list;
            return response;
        }
        return [];
    },
    
    get_year: function(date) {
        date = date.split(' ')[0].split('-');
        return date[0];
    },
    
    get_groups: function(interiors, architecture, retail, commercial) {
        var groups = '[';
        if (interiors == 1)
            groups += '"interiors"';
        if (architecture == 1) {
            if (groups.length > 1)
                groups += ', ';
            groups += '"architecture"';
        }
        if (retail == 1) {
            if (groups.length > 1)
                groups += ', ';
            groups += '"retail"';
        }
        if (commercial == 1) {
            if (groups.length > 1)
                groups += ', ';
            groups += '"commercial"';
        }
        groups += ']';
        return groups;
    },
    
    get_categories: function(interiors, architecture, retail, commercial) {
        var categories = '';
        if (interiors == 1)
            categories += 'interiors';
        if (architecture == 1) {
            if (categories.length > 0)
                categories += ', ';
            categories += 'architecture';
        }
        if (retail == 1) {
            if (categories.length > 0)
                categories += ', ';
            categories += 'retail';
        }
        if (commercial == 1) {
            if (categories.length > 0)
                categories += ', ';
            categories += 'commercial';
        }
        return categories;
    }

};


$(document).ready(work.init());
