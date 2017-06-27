function outputListening(data) {
    if (Object.keys(data).length >= 1 && data.song_artist != "") {
        if (data.song_name == null || data.song_name == "" && data.song_album != null) {
            $('#listening_song').html(data.song_album);
            $('#listening_artist').html(data.song_artist);
        } else {
            $('#listening_song').html(data.song_name);
            $('#listening_artist').html(data.song_artist);
        }

        if (data.song_album_art != null && data.song_album_art != "") {
            $('.listening.currently_img').css('background-image', 'url(' + data.song_album_art + ')');
        } else {
            $('.listening.currently_img').css('background-image', 'url(/assets/img/currently/music.png)');
        }

        $('.currently.listening').css({'display': 'inherit'});
        $('#currently_loading').css({'display': 'none'});
    } else {
        // console.log('empty');
    }
}

function outputWatching(data) {
    if (Object.keys(data).length >= 1 && data.show_title != "") {

        $('#watching_title').html(data.show_title);

        if (data.show_cover != null && data.show_cover != "") {
            $('.watching.currently_img').css('background-image', 'url(' + data.show_cover + ')');
        } else {
            $('.watching.currently_img').css('background-image', 'url(/assets/img/currently/tv.png)');
        }

        $('.currently.watching').css({'display': 'inherit'});
        $('#currently_loading').css({'display': 'none'});
    } else {
        // console.log('empty');
    }
}

function outputReading(data) {
    if (Object.keys(data).length >= 1 && data.book_name != "") {

        $('#reading_name').html(data.book_name);
        $('#reading_author').html(data.book_author);

        if (data.book_cover != null && data.book_cover != "") {
            $('.reading.currently_img').css('background-image', 'url(' + data.book_cover + ')');
        } else {
            $('.reading.currently_img').css('background-image', 'url(/assets/img/currently/book.png)');
        }

        $('.currently.reading').css({'display': 'inherit'});
        $('#currently_loading').css({'display': 'none'});
    } else {
        // console.log('empty');
    }
}

$(document).ready(function() {
        // get listening
        $.ajax({
            url: "http://bt-currently.herokuapp.com/getListening",
            data: null
        }).done(function(data) {
            outputListening(data);
        });

        // get watching
        $.ajax({
            url: "http://bt-currently.herokuapp.com/getWatching",
            data: null
        }).done(function(data) {
            outputWatching(data);
        });

        // get reading
        $.ajax({
            url: "http://bt-currently.herokuapp.com/getReading",
            data: null
        }).done(function(data) {
            outputReading(data);
        });

        // get working
        /*
        $.ajax({
            url: "http://bt-currently.herokuapp.com/getWorking",
            data: null
        }).done(function(data) {
            outputWorking(data);
        });
        */
});