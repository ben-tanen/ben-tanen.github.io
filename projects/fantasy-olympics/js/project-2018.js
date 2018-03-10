
/*********************/
/*** INIT VARIABLE ***/
/*********************/

var games_lookup = [ ];

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

function clean_predict_num(num_str) {
    if (isNaN(parseFloat(num_str))) return "-";
    return parseFloat(num_str).toFixed(2)
}

function clean_country_name(country_name) {
    return country_name.substring(0,2).toLowerCase()
}

/********************************/
/*** PARSE DATA AND INIT PLOT ***/
/********************************/

d3.csv("/projects/fantasy-olympics/data/predictions.csv", function(error, data) {

    // add prediction data to table
    for (var i = 0; i < data.length; i++) {
        datum = data[i];
        
        var row_str = "<tr>";
        for (key in datum) {
            if (key == "Country") row_str += `<td><img class="flag-icon" src="https://lipis.github.io/flag-icon-css/flags/4x3/${datum["Country Code"].toLowerCase()}.svg" />${datum["Country"]}</td>`;
            else if (key == "" || key == "Country Code") continue;
            else if (key == "total") row_str += `<td>${clean_predict_num(datum[key])}</td>`;
            else if (clean_predict_num(datum[key]) != "-") row_str += `<td class="predict_cell" data-team="${datum["Country"]}" data-sport="${key}">${clean_predict_num(datum[key])}</td>`;
            else row_str += `<td>${clean_predict_num(datum[key])}</td>`;
        }
        row_str += "</tr>";
        $('table#fo-prediction-table tbody').append(row_str);
    }

    // build historical data lookup
    d3.csv("/projects/fantasy-olympics/data/g_lookup.csv", function(error, data) {
        for (var i = 0; i < data.length; i++) {
            datum = data[i];
            c3 = datum["Code-3"];
            sport = datum["Sport"];

            if (!games_lookup[c3]) games_lookup[c3] = { };
            if (!games_lookup[c3][sport]) games_lookup[c3][sport] = [ ];

            games_lookup[c3]["Name"] = datum["Country"];

            desc_str = datum["Games"] + " - G:" + datum["G"] + ", S:" + datum["S"] + ", B:" + datum["B"] 
            games_lookup[c3][sport].push(desc_str);
        }
    })

    // init tooltip
    new jBox('Tooltip', {
        attach: '.predict_cell',
        content: $('#jbox-content-grab'),
        onOpen: function() {
            $("#jbox-content-history li").remove();

            var team = $(this.source).attr('data-team');
            var sport = $(this.source).attr('data-sport');

            $('#jbox-content-team').html(games_lookup[team]["Name"]);
            $('#jbox-content-sport').html(sport);

            var history = games_lookup[team][sport];

            if (games_lookup[team][sport])
                for (var i = 0; i < history.length; i++) $("#jbox-content-history").append("<li>" + history[i] + "</li>");
            else $("#jbox-content-history").append("<li>N/A</li>");
        },
        position: {
            x: 'right',
            y: 'center'
        },
        offset: {x: -16},
        outside: 'x'
    });
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

// set text directing where static chart is
if ($(window).width() <= 900) $('#fo-chart-loc-text').html('below');
else $('#fo-chart-loc-text').html('on the right');

$(window).resize(function() {
    if ($(window).width() <= 900) $('#fo-chart-loc-text').html('below');
    else $('#fo-chart-loc-text').html('on the right');
});

