$(document).ready(function(){       
   var scroll_start = 0;
   var startchange = $('#startchange');
   var offset = startchange.offset();
    if (startchange.length){
   $(document).scroll(function() { 
      scroll_start = $(this).scrollTop();
      if($(window).width() < 960) {
          $(".navbar-default").css('background-color', 'rgba(255, 255, 255, 0.93)');
          $(".navbar-brand-custom").css('color', 'black');
          $(".item").css('color', 'black!important');
       } else if ((scroll_start > offset.top ) && ($(window).width() > 960) ) {
          $(".navbar-default").css('background-color', 'rgba(255, 255, 255, 0.93)');
          $(".navbar-brand-custom").css('color', 'black');
          $(".item").css('color', 'black!important');
         
       } else {
          $('.navbar-default').css('background-color', 'transparent');
       }
   });
    }
});