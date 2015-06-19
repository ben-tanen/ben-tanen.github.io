function pageResize() {
	var window_width = $(window).width();
	var window_height = $('.side').height();

	// main width resize
	if (window_width - 275 > 800) {
		$('.main').css('width', 800 + 'px');
	} else if (window_width - 275 < 500){
		$('.main').css('width', 500 + 'px');
	} else {
		$('.main').css('width', window_width - 275 + 'px');
	}
}

$(document).ready(function() {
	pageResize();

	$(window).resize(pageResize);
});