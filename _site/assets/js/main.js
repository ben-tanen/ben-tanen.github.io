$(document).ready(function() {
    var lastScrollTop = 0;
    
    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > 150 && st > lastScrollTop){
            $('#side').addClass('hidden');
        } else {
            $('#side').removeClass('hidden');
        }
        lastScrollTop = st;
    });
});