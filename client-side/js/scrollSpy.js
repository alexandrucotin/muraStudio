$(document).ready(function(){       
   var scroll_start = 0;
   var startchange = $('#startchange');
   var offset = startchange.offset();
    if (startchange.length){
   $(document).scroll(function() { 
      scroll_start = $(this).scrollTop();
      if(scroll_start > offset.top) {
          $(".navbar-default").css('background-color', 'rgba(255, 255, 255, 0.7)');
       } else {
          $('.navbar-default').css('background-color', 'transparent');
       }
   });
    }
});