function pageResize() {
	$('.side').css('left', $('.wrapper').css('margin-left'));

    if ($('.side').width() > 250) $('.side').addClass('mobile');
    else $('.side').removeClass('mobile');
}

$(document).ready(function() {
    var lastScrollTop = 0;
	
    pageResize();
	$(window).resize(pageResize);
    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > 150 && st > lastScrollTop){
            $('.side.mobile').addClass('hidden');
        } else {
            $('.side.mobile').removeClass('hidden');
        }
        lastScrollTop = st;
    });
});