var teamLogos = {
    'ANA': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/anaheim-ducks.png',
    'ARI': null,
    'BOS': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/boston-bruins.png',
    'BUF': null,
    'CGY': null,
    'CAR': null,
    'CHI': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/chicago-blackhawks.png',
    'COL': null,
    'CBJ': null,
    'DAL': null,
    'DET': null,
    'EDM': null,
    'FLA': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/florida-panthers.png',
    'LAK': null,
    'MIN': null,
    'MTL': null,
    'NSH': null,
    'NJD': null,
    'NYI': null,
    'NYR': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/new-york-rangers.png',
    'OTT': null,
    'PHI': null,
    'PIT': null,
    'SJS': null,
    'STL': null,
    'TBL': null,
    'TOR': null,
    'VAN': null,
    'WSH': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/washington-capitals.png',
    'WPG': null,
};

function parseTeamData(line) {
    keys = ['team', 'actual_pts', 'current_proj', 'current_diff', 'original_proj', 'original_diff'];
    obj  = { };

    for (var i = 0; i < keys.length; i++){
        if (i < line.length) obj[keys[i]] = line[i];
        else return obj;
    }

    obj['logo'] = teamLogos[obj['team']];

    return obj;
}

function updatePoints(data) {

    // parse csv file and store in object
    var teams = [ ]
    var lines = data.split(/\r\n|\n/);

    for (var i = 1; i < lines.length; i++) {
        line     = lines[i].split(',');
        teamData = parseTeamData(line);
        teams.push(teamData);
    }

    // sort object

    // update table
    for (var i = 0; i < teams.length; i++) {
        var row_str = '<tr><td><img style="width: 50px; padding: 3px 5px 3px 10px;" />';
        for (var j = 0; j < $('#projections_table tr:nth-child(1)').children().length; j++) row_str += '<td></td>';
        row_str += '</tr>'; 
        $('#projections_table').append(row_str);

        var url = teams[i]['logo']
        var obj = $('#projections_table tr:nth-child(' + (2 + i) + ')');
        $(obj.children()[0]).children().attr('src',teams[i]['logo']);
        $(obj.children()[1]).html(teams[i]['team']);
        $(obj.children()[2]).html(teams[i]['actual_pts']);
        $(obj.children()[3]).html(teams[i]['current_proj']);
        $(obj.children()[4]).html(teams[i]['current_diff']);
        $(obj.children()[5]).html(teams[i]['original_proj']);
        $(obj.children()[6]).html(teams[i]['original_diff']);
    }
}

$(document).ready(function() {
    $('#nhl-about #expand-img').click(function() {
        $('#nhl-about').toggleClass('min');
        $('#nhl-about').toggleClass('expand');
    });

    $('.nhl_current_projection #expand-img').click(function() {
        $('.nhl_current_projection').toggleClass('min');
        $('.nhl_current_projection').toggleClass('expand');
    });

    $.ajax({
        type: "GET",
        url: "files/data/current.csv",
        dataType: "text",
        success: function(data) { updatePoints(data); }
     });
});