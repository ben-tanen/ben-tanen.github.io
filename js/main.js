function pageResize() {
	var window_width = $(window).width();

	// main width resize
	if (window_width - 275 > 800) {
		$('.main').css('width', 800 + 'px');
		$('.side').css('left', $('.wrapper').css('margin-left'))
	} else if (window_width - 275 < 500 || $('.side').width() != 250){
		$('.main').css('width', 500 + 'px');
	} else {
		$('.main').css('width', window_width - 275 + 'px');
	}
}

$(document).ready(function() {
	pageResize();

	$(window).resize(pageResize);
});