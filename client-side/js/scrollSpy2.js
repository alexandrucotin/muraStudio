$(document).ready(function(){       
    var scroll_start = 0;
    var startchange = $('#startchange');
    var offset = startchange.offset();
    if ($(window).width() < 960) {
        $(".navbar").css('background-color', 'rgba(255, 255, 255, 0.93)');
        $(".navbar-brand-custom").css('color', 'black');
        $(".item").css('color', 'black');
        $("#filter-navbar").css('display', 'none');
    } else if (startchange.length){
        $(document).scroll(function() { 
           scroll_start = $(this).scrollTop();
           if ((scroll_start > offset.top ) && ($(window).width() > 960) ) {
              $(".navbar").css('background-color', 'rgba(255, 255, 255, 0.93)');
              $(".navbar-brand-custom").css('color', 'black');
              $(".item").css('color', 'black');

           } else {
              $('.navbar').css('background-color', 'transparent');
              $(".navbar-brand-custom").css('color', 'white');
              $(".item").css('color', 'white');
               $(".navbar-toggler-icon").css('background-image','url("http://www.casadellasalutelivorno.it/img/burger-menu.png")')
           }
       });
    }
});