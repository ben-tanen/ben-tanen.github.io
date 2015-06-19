$(document).ready(function() {
    gallery_width = 800;
    gallery_height = 400;

    for (i = 0; i < $('.gallery ul').children('li').length; i++) {
        img_hgt = $('.gallery ul li:nth-of-type(' + (i + 1) + ') img').height();
        $('.gallery ul li:nth-of-type(' + (i + 1) + ') img').css({'margin-top': '-' + (img_hgt / 2) + 'px'});
    }

    $('#gallery_forward').click(function() {
        console.log('forward');
        if (parseInt($('.gallery ul').css('left').replace('px','')) - (gallery_width + 9) <= $('.gallery ul').children('li').length * (gallery_width) * -1) {
            $('.gallery ul').animate({left: '0px'});
        } else {
            $('.gallery ul').animate({left: '-=' + (gallery_width + 9) + 'px'});
        }
    });

    $('#gallery_back').click(function() {
        console.log(parseInt($('.gallery ul').css('left').replace('px','')));
        if (parseInt($('.gallery ul').css('left').replace('px','')) >= 0 || parseInt($('.gallery ul').css('left').replace('px','')) == NaN) {
            $('.gallery ul').animate({left: ($('.gallery ul').children('li').length - 1) * (gallery_width + 9) * -1 + 'px'});
        } else {
            $('.gallery ul').animate({left: '+=' + (gallery_width + 9) + 'px'});
        }
    });
});