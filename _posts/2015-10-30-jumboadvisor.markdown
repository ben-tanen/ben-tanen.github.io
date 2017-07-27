---
layout: post
title:  'Tufts Polyhack 2015: JumboAdvisor'
date:   2015-10-30 15:05:41
categories: project tufts advisement-report
thumbnail: /assets/img/post-thumbnails/jumbo-advisor.png
---

Figuring out what courses to take as a college student can be a slightly confusing process. What classes count for what requirements? What requirements do I even need for my major? What will my college career look like with all these courses?

Tufts (and the lovely people over at PeopleSoft) attempted to offer a tool called the Advisement Report which would help guide students through these questions. However, this tool is incredibly stupid, offering zero flexibility in terms of moving things around your "degree sheet". If you want to move one course from one requirement to another, too bad. If you want to check out another major to see if switching majors is possible, you're out of luck. Trying out minors or double majors? No way.

This is where [JumboAdvisor](http://ben-tanen.github.io/JumboAdvisor/) comes in. Done as a project for Tufts Polyhack 2015, JumboAdvisor is intended to allow flexibility in the college course planning process. Want to see if one course counts for a certain requirement? Want to swap around course to your heart's content? Want to see what your college career will look like with all of these CS and math courses? Go right ahead.

{% include figure.html src="/assets/img/posts/jumboadvisor.png" alt="A screenshot of JumboAdvisor" width="600px" %}

This was a joint effort including work from [Alex Golin](https://github.com/agolin95), [Nolan Martin](https://github.com/menlonoma), [Samantha Welch](https://github.com/swelch01), [Michael Seltzer](https://github.com/mseltzer94), and [Jackson Clawson](https://github.com/jclaw). The site is built with pretty simple HTML, CSS, and JS with no real tricks involved. The original intention was to use something like Angular.js to build drag and droppable sections but hackathons...

Due to the typical woes of a 24-hour hackathon, the site is not fully built. It is more intended as a proof of concept to show the capabilities and functionality that an advisement report *should* have. The next steps for this project include pitching it successfully to Tufts and building out all the desired features (including data connectivity, better validation, and minors and double majors).

For more, you can see current site [here](http://ben-tanen.github.io/JumboAdvisor/) and the source code [here](https://github.com/ben-tanen/JumboAdvisor). Any updates on this project will likely be posted here but you can also check the GitHub repo.

