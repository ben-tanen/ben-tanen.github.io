---
layout: post
title:  How To Get (Good) Tickets for Sundance Film Festival
date:   2026-02-02 10:00:00
thumbnail: /assets/img/post-thumbnails/sundance-egyptian.webp
new-post-style: true
---

The 2026 Sundance Film Festival wrapped up yesterday, and with that, Sundance now sadly departs Utah for Boulder in 2027 and beyond. As a Utah resident and a regular attendee since 2018, this move to Colorado pains me deeply for many reasons. Beyond the obvious, I am pained because after many years of learning and adapting to the quirks of the Sundance Film Festival ticket game, I finally locked in on my strategy to secure an optimal line-up for the festival. This strategy includes:

(1) *Live in Utah*: As a local resident, you can (hopefully) purchase a Locals Ticket Package that offers 10 tickets at a discounted price PLUS the ability to select films earlier than most standard Ticket Package holders. 

This was clutch in years past, but I was unfortunately unable to snag one of these packages for the 2026 festival as they sold out in about 10 seconds.
    
(2) *Make A (Good) Plan*: 2026 was my ninth year of attending Sundance in some capacity, so along the way, I’ve learned a lot of tricks and quirks of how to make a good schedule (at least for me). You’ve got to know how to parse through the relatively limited one to two-paragraph write-ups that each film has in the program, you’ve got to understand the logistics of getting from one theater to another, and you’ve got to know where your best chances of getting hot tickets are, especially those precious premieres with film team Q&As. And on top of all of that, you’ve got to keep all of this organized, which I’ve locked in on doing with an overly-complicated system of Notion pages, calendar events, and using sites like Reddit and [Festiful](https://www.festiful.net/). 
    
Unfortunately, a lot of people attending Sundance have their own systems and plans, so you might still get beat on your schedule and plan, which means you’ve also got to stay attentive, which I was able to do with…
    
(3) *Use Code to Constantly Monitor for Tickets*: This was a new addition to my system this year and it was absolutely clutch to save my festival after components (1) and (2) of the strategy struggled this year. However, since this will seemingly be my last Sundance (ever? for awhile? who knows…), I figured I’d spill the beans on this trick for any future programming-inclined festival attendees…

{% include section-break.html %}

The trick I discovered this year for programmatically monitoring for tickets is that Sundance seems to expose a ton of information about screenings and ticket availability via an API. By querying this API, you can get a full listing of every screening with information about the film, plus the capacity of the venue and the number of tickets available at any instance.

```bash
curl -X GET \
  "https://api.eventive.org/event_buckets/67a0f8057aa6eac072bf986b/events" \
  -H "Authorization: Basic YOUR_AUTH_TOKEN"
```

`YOUR_AUTH_TOKEN` can be found pretty easily from simply inspecting the requests made to the Sundance website once you’re logged in.

{% include figure.html src="/assets/img/posts/sundance-auth-screenshot.png" alt='A screenshot of the Sundance Film Festival website with the Network inspector panel open, showing details of the requests made to the SFF `events` API, including the Authorization token' %}

Using this API, I just sent up [some Python code](https://gist.github.com/ben-tanen/5637fb576fbc98656b4c5c0ae4012c10) that continuously monitored for new ticket drops with a specific focus on the films and screenings I was interested in.

This could have been relatively simple, but as I always do, I over-engineered a whole system that would constantly check a dynamic YAML rules file that specified which films I was interested in and how often it should check. For example, this file at one point looked like:

```yaml
config:
  sleep: 15       # how long to sleep (seconds)
  alert_sounds: 3 # how many times to beep (if loud = True)
  
checks:
  # monitor for any premieres of the named films
  - query:
    - fn: name_in
      list: 
        - I Want Your Sex
        - The Gallerist
        - The Moment
        - Buddy
        - The Invite
        - The History of Concrete
        - The Shitheads
        - The Weight
        - Wicker
        - Gail Daughtry and the Celebrity Sex Pass
    - premiere_screening
  description: premiere screenings of major interest
  loud: True
      
  # monitor for any available screenings on 2026-01-29
  - query:
    - start_time < '2026-01-30 00:00'
    - start_time > '2026-01-29 00:00'
    description: screenings on Jan 29
    
  # monitor for any screenings of The History of Concrete
  - query:
    - fn: name_in
      list:
      - The History of Concrete
    description: screenings of The History of Concrete (any)

  # monitor for any available tickets for zi online screening
  - query:
    - name == "zi"
    - venue == "Virtual"
    - not opi_screening
    description: virtual screenings of zi
    loud: True
```

And this would make my code query the API/site every 15-seconds, resulting in status updates like those seen below.

{% include figure.html src="/assets/img/posts/sundance-logs1.png" alt='A screenshot of the logs from my code showing two available screenings on January 29' %}

I even ended up adding in some functionality to use the system sounds on my Mac to beep at me whenever tickets became available for screenings of particular interest, which I just enabled in my YAML file by adding `loud: True`. This particular addition was the extra special secret sauce that made it so I could leave the system running without having to monitor the logs 100% of the time.

{% include figure.html src="/assets/img/posts/sundance-logs2.png" alt='A screenshot of the logs from my code showing a premiere screening for Buddy with emojis indicating it played sound' %}

{% include section-break.html %}

Through all of that, my wife and I got quite lucky, and we were able to attend pretty much everything we were hoping for ([check out Letterboxd for the full list](https://letterboxd.com/btanen/tag/sundance/diary/for/2026/)). We were also able to help out some other folks from Reddit/WhatsApp who were also looking for tickets, including some people from film teams who weren't able to get tickets to their own premiere—crazy how that's a thing...

So while I likely won't be attending Sundance in Boulder anytime soon, I do hope this mini-guide might be useful to someone else attending the festival in the future. All I ask for is that you try to pay it forward a bit and look out for people, like those on the film teams, who might really benefit from the tickets that you are now graced with extra-human abilities to snag.

❤️ Sundance Film Festival




