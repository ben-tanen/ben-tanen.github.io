from bs4 import BeautifulSoup
import requests, re, csv

events = {
    "Alpine Skiing": ["Alpine Combined Men", "Downhill Men", "Giant Slalom Men", "Slalom Men", "Super Combined Men", "Super-G Men", "Alpine Combined Women", "Downhill Women", "Giant Slalom Women", "Slalom Women", "Super Combined Women", "Super-G Women"],
    "Biathlon": ["10km Men", "12.5km Pursuit Men", "15km Mass Start Men", "20km Men", "4x7.5km Relay Men", "10km Pursuit Women", "12,5km Mass Start Women", "15km Women", "4x6km Relay Women", "7.5km Women", "Mixed Relay"],
    "Bobsleigh": ["Four-man Men", "Two-man Men", "Two-man Women"],
    "Cross Country Skiing": ["15km Men", "15km 15km Skiathlon", "4x10km Relay Men", "50km Men", "Sprint 1,5km Men", "Team Sprint Men", "10km Women", "30km Women", "4x5km Relay Women", "7.5km 7.5km Skiathlon", "Sprint 1.5km Women", "Team Sprint Women"],
    "Curling": ["Curling Men", "Curling Women"],
    "Figure Skating": ["Individual Men", "Individual Women", "Ice Dancing Mixed", "Mixed Noc Team Mixed", "Pairs Mixed"],
    "Freestyle Skiing": ["Aerials Men", "Halfpipe Men", "Moguls Men", "Ski Cross Men", "Slopestyle Men", "Aerials Women", "Halfpipe Women", "Moguls Women", "Ski Cross Women", "Slopestyle Women"],
    "Ice Hockey": ["Ice Hockey Men", "Ice Hockey Women"],
    "Luge": ["Doubles", "Singles Men", "Singles Women", "Mixed Team Relay"],
    "Nordic Combined": ["Sprint K120 Men"],
    "Short Track Speed Skating": ["1000m Men", "1500m Men", "5000m Relay Men", "500m Men", "1000m Women", "1500m Women", "3000m Relay Women", "500m Women"],
    "Skeleton": ["Individual Men", "Individual Women"],
    "Ski Jumping": ["K120 Individual 90m Men", "K120 Team 90m Men", "K90 Individual 70m Men", "K90 Individual 70m Women"],
    "Snowboard": ["Giant Parallel Slalom Men", "Half-pipe Men", "Parallel Slalom Men", "Slopestyle Men", "Snowboard Cross Men", "Giant Parallel Slalom Women", "Half-pipe Women", "Parallel Slalom Women", "Slopestyle Women", "Snowboard Cross Women"],
    "Speed Skating": ["10000m Men", "1000m Men", "1500m Men", "5000m Men", "500m Men", "Team Pursuit Men", "1000m Women", "1500m Women", "3000m Women", "5000m Women", "500m Women", "Team Pursuit Women"],
}
results = { }

# for each event in each sport
for sport in events:
    for event in events[sport]:

        # add result entry for new sport / event
        if sport not in results:
            results[sport] = { }
        if event not in results[sport]:
            results[sport][event] = { }

        # load in page
        url = "https://www.olympic.org/%s/%s/" % (sport.lower().replace(" ","-"),re.sub('(\ |\.|\,| \(| \))', '-', event.lower()))

        print(url)

        r = requests.get(url)
        s = BeautifulSoup(r.text, "lxml")

        # loop over event boxes for past winners
        ebs = s.findAll("section", {"class": "event-box"})
        if len(ebs) == 0:
            print(">>>>> NOTHING FOR %s" % url)

        for eb in ebs:

            # get games info
            g = eb.find("h2").find("a").contents[2]
            g = re.sub('(\\r\\n| {2,})', '', g)
            results[sport][event][g] = [ ]

            # pull in all medal winners
            ms = eb.findAll("div", {"class": "medal"})
            ts = eb.findAll("div", {"class": "text-box"})

            if len(ms) != len(ts):
                print(">>>>> Issue with: %s, %s, %s games" % (sport, event, g))
                continue

            # pull winners
            for i in range(0,len(ms)):
                m = dict(ms[i].attrs)["class"][1]

                # determine if single winner or team
                if len(ts[i].findAll('div', {'class': 'profile-row'})) > 0:
                    t = ts[i].find('div', {'class': 'profile-row'}).find('span').contents[0]
                else:
                    t = ts[i].find("strong").contents[0]
                
                results[sport][event][g].append({
                    'medal': m.title(),
                    'team': t
                })

# parse and export results
with open('past_winners.csv', 'w', newline = '') as csvfile:
    writer = csv.writer(csvfile, delimiter = ",")

    for sport in results:
        for event in results[sport]:
            for games in results[sport][event]:
                winners = results[sport][event][games]
                for i in range(0,len(winners)):
                    writer.writerow([sport, event, games, winners[i]['medal'], winners[i]['team']])
        