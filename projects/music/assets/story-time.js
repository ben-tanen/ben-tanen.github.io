$.ajax({
    type: "GET",
    url: "http://bt-dbs.herokuapp.com/getWMFOPlaylists",
    dataType: "text",
    success: function(d) {
        var d = JSON.parse(d);

        d.sort(function(a, b){
            var keyA = new Date(a.date),
                keyB = new Date(b.date);
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return  1;
            return 0;
        });

        for (var i = d.length - 1; i >= d.length - 3; i--) {
            $('#playlist-holder').append('<iframe class="playlist-item" width="100%" height="60" src="' + d[i].url + '" frameborder="0"></iframe>');
        }

        setTimeout(function() {
            $('#loading-spinner').fadeOut();
            $('.playlist-item:nth-of-type(-n+5)').animate({opacity: 1}, 500);
        }, 500);

        var playlist_ix = d.length - 3;

        setInterval(function() {
            if (playlist_ix > 0) playlist_ix = playlist_ix - 1;
            else return;

            $('.playlist-item:last-of-type').animate({opacity: 1}, 500);

            $('#playlist-holder').append('<iframe class="playlist-item" style="opacity: 0;" width="100%" height="60" src="' + d[playlist_ix].url + '" frameborder="0"></iframe>');
        }, 1000);
    }
});