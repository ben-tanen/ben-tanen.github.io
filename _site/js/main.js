function pageResize() {
	$('.side').css('left', $('.wrapper').css('margin-left'));
}

$(document).ready(function() {
	pageResize();

	$(window).resize(pageResize);
});