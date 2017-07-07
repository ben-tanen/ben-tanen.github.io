$.ajax({
    type: "GET",
    url: "http://bt-dbs.herokuapp.com/getVinylRecords",
    dataType: "text",
    success: function(d) {
        var d = JSON.parse(d);

        d.sort(function(a, b){
            if(a.ix < b.ix) return -1;
            if(a.ix > b.ix) return  1;
            return 0;
        });

        for (var i = d.length - 1; i >= 0; i--) {
            var album     = d[i].album,
                artist    = d[i].artist,
                cover_url = d[i].cover_url;

            $('#bt-record-holder').append('<div class="bt-record"><img src="' + cover_url + '" /><p><span style="color: #77bdee">' + album + '</span><br />' + artist + '</p></div>');
        }

        setTimeout(function() {
            $('#bt-record-holder').animate({opacity: 1}, 500);
        }, 500);
    }
});
