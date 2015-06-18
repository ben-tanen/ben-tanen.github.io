function pageResize() {
	var window_width = $(window).width();
	var window_height = $('.side').height();

	// side bar heigh resize

	// main width resize
	if (window_width - 250 > 800) {
		$('.main').css('width', 800 + 'px');
	} else if (window_width - 250 < 500){
		$('.main').css('width', 500 + 'px');
	} else {
		$('.main').css('width', window_width - 250 + 'px');
	}
}

$(document).ready(function() {
	pageResize();

	$(window).resize(pageResize);
});