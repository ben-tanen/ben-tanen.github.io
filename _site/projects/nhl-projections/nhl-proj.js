var teamLogos = {
    'ANA': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/anaheim-ducks.png',
    'ARI': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/arizona-coyotes.png',
    'BOS': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/boston-bruins.png',
    'BUF': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/buffalo-sabres.png',
    'CGY': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/calgary-flames.png',
    'CAR': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/carolina-hurricanes.png',
    'CHI': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/chicago-blackhawks.png',
    'COL': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/colorado-avalanche.png',
    'CBJ': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/columbus-blue-jackets.png',
    'DAL': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/dallas-stars.png',
    'DET': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/detroit-red-wings.png',
    'EDM': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/edmonton-oilers.png',
    'FLA': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/florida-panthers.png',
    'LAK': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/los-angeles-kings.png',
    'MIN': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/minnesota-wild.png',
    'MTL': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/montreal-canadiens.png',
    'NSH': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/nashville-predators.png',
    'NJD': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/new-jersey-devils.png',
    'NYI': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/new-york-islanders.png',
    'NYR': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/new-york-rangers.png',
    'OTT': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/ottawa-senators.png',
    'PHI': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/philadelphia-flyers.png',
    'PIT': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/pittsburgh-penguins.png',
    'SJS': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/san-jose-sharks.png',
    'STL': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/st-louis-blues.png',
    'TBL': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/tampa-bay-lightning.png',
    'TOR': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/toronto-maple-leafs.png',
    'VAN': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/vancouver-canucks.png',
    'WSH': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/washington-capitals.png',
    'WPG': 'http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/winnipeg-jets.png',
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
        var row_str = '<tr><td><img style="width: 30px; padding-bottom: 4px; padding-left: 15px;" />';
        for (var j = 0; j < $('#projections_table thead tr:nth-child(1)').children().length - 1; j++) row_str += '<td></td>';
        row_str += '</tr>'; 
        $('#projections_table tbody').append(row_str);

        var url = teams[i]['logo']
        var obj = $('#projections_table tbody tr:nth-child(' + (1 + i) + ')');
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