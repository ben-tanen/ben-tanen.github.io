---
layout: post
title:  'Introducing 2016-17 NHL Projections'
date:   2016-10-11 15:05:41
categories: hockey nhl-projections data project matlab
---

Last year as the 2015-16 NHL season came to a close, I built a fairly simplistic MATLAB model in an effort to (hopefully accurately) simulate the season. The model was built to take in some amount of past game data and use this to predict game-by-game performances over the entire season, resulting in season-long performances for each team. If you're interested, you can read [the original model report](http://localhost:4000/projects/nhl-projections/files/NHL_Projections-Full_Report.pdf){:target="_blank"} as well as check out [the code](https://github.com/ben-tanen/NHLPlayoffProjections){:target="_blank"}.

Originally, this model was to be used in the early Spring (March / April 2016) simply to predict the last month or so of the 2015-16 regular season, but the model appeared to work fairly well going as far back as the first weeks of the season. Given this, I decided I would put my model to the test with the new 2016-17 NHL season (starting tomorrow!).

{% include figure.html src="/img/posts/nhl_proj_10_11_16.png" width='650px'%}

So, over the course of the next few months, I'll be continuously comparing each team's expected performance (as speculated by the model) to their actual performance. I'll also be tweaking the model and using it to run other predictions and analyses, just to see what I can come up with. For more on the project, as well as the most up-to-date projections, check out [the new project site here](/projects/nhl-projections/). 

For a little sneak peak, to start off the season, the model is only working with game data from the 2015-16 season and the handful of pre-season games so I don't have the highest expectations for these predictions. See below for the top 8 projected teams, all of who (with the exception of Boston) made the playoffs last season.

<table id="projections_table">
<thead>
<tr><th></th><th width="50px">Team</th><th width="150px">Projected Points (2016-17)</th><th width="100px">Actual Points (2015-16)</th></tr>
</thead>
<tbody>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/dallas-stars.png"></td><td>DAL</td><td>96.31</td><td>109</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/pittsburgh-penguins.png"></td><td>PIT</td><td>95.53</td><td>104</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/chicago-blackhawks.png"></td><td>CHI</td><td>94.76</td><td>103</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/san-jose-sharks.png"></td><td>SJS</td><td>94.06</td><td>98</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/new-york-rangers.png"></td><td>NYR</td><td>93.33</td><td>101</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/tampa-bay-lightning.png"></td><td>TBL</td><td>93.24</td><td>97</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/boston-bruins.png"></td><td>BOS</td><td>92.53</td><td>93</td></tr>

<tr><td><img style="width: 30px; padding-bottom: 8px; padding-left: 7px; padding-top: 7px; margin: auto; vertical-align: center;" src="http://www.sportsnet.ca/wp-content/themes/sportsnet-nhl/images/team_logos/200x200/hockey/nhl/st-louis-blues.png"></td><td>STL</td><td>91.82</td><td>107</td></tr>

</tbody>
</table>

Here's to an exciting 2016-17 season and [#LGR](https://twitter.com/search?q=lgr){:target="_blank"}!
