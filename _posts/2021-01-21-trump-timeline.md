---
layout: post
title:  "How Well Do You Remember Trump's Term In Office?"
date:   2021-01-23 10:05:41
thumbnail: /assets/img/post-thumbnails/trump-timeline.jpeg
landing-proj: false
new-post-style: true
d3v: v6
---

This week marked the close of the Trump Presidency and throughout the week, different outlets have been recollecting all of the craziness that happened in the past four plus years. [The New York Times prepared such a video](https://www.youtube.com/watch?v=e2FNujc0UM4) and as I was watching, I realized how warped my memory and sense of time for these events had gotten. Some events felt like years ago but were only months ago. Some I didn't remember at all even though they felt significant at the time.

Given the fact that January 2021 has already felt like a lifetime and 2020 felt like a thousand lifetimes, it is fairly well agreed upon that [the ongoing pandemic and everything else has done a number on our sense of time](https://www.discovermagazine.com/mind/how-the-coronavirus-pandemic-is-warping-our-sense-of-time). To test all of this, I put together a little memory exercise to see how well we all remember (or don't remember) the endless-news-whirlwind that has been the Trump Presidency.

*To answer, drag the slider to when you think the event occurred. To start, the slider will be positioned randomly along the timeline so don't take that as a hint. Also don't worry about getting it exactly right, I'll give some partial credit.*

<div id="trump-timeline-container">
</div>

<p id="view-more">Want more? <span>Click here to view the rest</span></p>

<style>
    #trump-timeline-container {
        width: 100%;
        margin: 30px 0;
    }

    #trump-timeline-container > div {
        margin-bottom: 50px;
        position: relative;
    }

    #trump-timeline-container > div.hidden {
        display: none;
    }

    #trump-timeline-container > div:nth-last-of-type(1):not(.hidden) {
        margin-bottom: 0;
    }

    #trump-timeline-container > div > p {
        margin-bottom: 0;
        margin-left: 50px;
        margin-right: 50px;
        max-width: initial;
        width: calc(100% - 215px);
    }

    .question-text {
        font-weight: 500;
        color: #77bdee;
    }

    .grade-text {
        width: initial !important;
    }

    .submit-btn {
        width: 100px;
        border-radius: 5px;
        position: absolute;
        top: 0;
        right: 50px;
        background-color: #77bdee;
        cursor: pointer;
    }

    .submit-btn.locked {
        background-color: #eee;
        cursor: default;
    }

    .submit-btn p {
        text-align: center !important;
        margin: 0;
        padding: 3px;
        color: white;
    }

    .trump-timeline-svg {
        width: 100%;
        height: 70px;
    }

    rect.timeline {
        fill: #bbb;
    }

    rect.timeline-tick {
        fill: #bbb;
    }

    rect.timeline.cover {
        fill: rgba(255, 0, 0, 0.5);
    }

    g.answer-sect {
        display: initial;
    }

    g.answer-sect.hidden {
        display: none;
    }

    circle.slider {
        fill: white;
        stroke: black;
        stroke-width: 2px;
    }

    circle.slider-target {
        fill: rgba(255, 0, 0, 0);
        cursor: ew-resize;
    }

    g.slider-sect.locked circle.slider-target {
        cursor: default;
    }

    g.slider-sect.locked polygon {
        display: none !important;
    }

    text.slider-text, text.answer-text {
        text-anchor: middle;
        font-size: 13px;
        alignment-baseline: middle;
    }

    p#view-more {
        text-align: center;
    }

    p#view-more > span {
        color: white;
        cursor: pointer;
        padding: 2px 5px;
        background-color: #77bdee;
        border-radius: 5px;
    }

    p#view-more > span:hover {
        /*text-decoration: underline;*/
    }
</style>
<script>
/**********************/
/*** INIT VARIABLES ***/
/**********************/

const margin = {top: 0, right: 50, bottom: 0, left: 50},
      sect_height = 70,
      timeline_height = 5,
      tick_dim = [2, timeline_height * 3];

// create scales
const x = d3.scaleLinear().domain([1, 1462]).range([0, $("#trump-timeline-container").width() - margin.right - margin.left]),
      date = d3.scaleLinear().domain([1, 1462]).range([new Date("2017-01-20"), new Date("2021-01-20")]);

/********************************/
/*** DECLARE HELPER FUNCTIONS ***/
/********************************/

// format readable date
const format_date = (date, format) => {
    return d3.utcFormat(format ? format : "%b %d, %Y")(date);
}

// format readable date difference
const format_date_diff = (day_diff) => {
    const years = Math.floor(day_diff / 365),
          months = Math.floor((day_diff % 365) / (365 / 12)),
          days = Math.round((day_diff % 365 % 30));

    if (day_diff > 365) return "over a year";
    else if (day_diff > 320) return "almost a year";
    else if (day_diff > 180) return "more than 6 months"
    else if (day_diff > 60) return "a few months";
    else if (day_diff > 14) return "a few weeks";
    else return "a few days";
}

// create components of each timeline
const init_sects = (data) => {

    const cont = d3.select("#trump-timeline-container")
        .selectAll("#trump-timeline-container div")
        .data(data).enter()
        .append("div")
        .classed("hidden", (d, i) => i >= 5);

    cont.append("p")
        .classed("question-text", true)
        .attr("id", d => d.event_id)
        .text(d => "Do you remember when " + d.event_description + "?");

    const btns = cont.append("div")
        .classed("submit-btn", true)
        .classed("locked", true)
        .attr("id", d => d.event_id);

    btns.append("p")
        .text("How'd I do?");

    btns.on("click", (event, d) => {
        const tar = event.currentTarget;
        if (!d3.select(tar).classed("locked")) {
            const id = tar.id;
            d3.select(tar).classed("locked", true); // lock the button
            d3.select("g.slider-sect#" + id).classed("locked", true); // lock the slider
            d3.select("g.answer-sect#" + id).classed("hidden", false); // remove the timeline cover
            d3.select("p.grade-text#" + id).text(d => {
                const day_diff = d.event_day - Math.round(d.slider_day),
                      formatted_day_diff = format_date_diff(Math.abs(d.event_day - d.slider_day)),
                      early_late = day_diff > 0 ? "early" : "late";
                if (Math.abs(day_diff) < 5) return "Right on the money!";
                else if (Math.abs(day_diff) < 30) return `Nice job! You were only ${formatted_day_diff} ${early_late}!`;
                else if (Math.abs(day_diff) < 90) return `Close! You were ${formatted_day_diff} ${early_late}.`;
                else return `Not quite... you were off by ${formatted_day_diff}.`;
            });
        }
    })

    const svgs = cont.append("svg")
        .classed("trump-timeline-svg", true);

    cont.append("p")
        .classed("grade-text", true)
        .attr("id", d => d.event_id)
        .text("");

    const timelines = svgs.append("g")
        .classed("timeline-sect", true)
        .attr("id", d => d.event_id)
        .attr("transform", `translate(${margin.left}, ${(sect_height - timeline_height) / 2})`);

    timelines.append("rect")
        .classed("timeline", true)
        .attr("id", d => d.event_id)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x.range()[1])
        .attr("height", timeline_height);

    timelines.selectAll("timeline-tick")
        .data([new Date("2018-01-01"), new Date("2019-01-01"), new Date("2020-01-01"), new Date("2021-01-01")]).enter()
        .append("rect")
        .classed("timeline-tick", true)
        .attr("x", d => x(date.invert(d)) - tick_dim[0] / 2)
        .attr("y", (timeline_height - tick_dim[1]) / 2)
        .attr("width", tick_dim[0])
        .attr("height", tick_dim[1]);

    const answers = svgs.append("g")
        .classed("answer-sect", true)
        .classed("hidden", true)
        .attr("id", d => d.event_id)
        .attr("transform", d => `translate(${margin.left + x(d.event_day)}, ${sect_height / 2})`);

    answers.append("text")
        .classed("answer-text", true)
        .attr("id", d => d.event_id)
        .attr("x", 0)
        .attr("y", -timeline_height * 3.2)
        .text(d => format_date(d.event_date));

    answers.append("rect")
        .classed("answer-tick", true)
        .attr("x", -tick_dim[0] / 2)
        .attr("y", -tick_dim[1] / 2)
        .attr("width", tick_dim[0])
        .attr("height", tick_dim[1]);

    const sliders = svgs.append("g")
        .classed("slider-sect", true)
        .attr("id", d => d.event_id)
        .attr("transform", d => `translate(${margin.left + x(d.slider_day)}, ${sect_height / 2})`);

    sliders.append("circle")
        .classed("slider", true)
        .attr("id", d => d.event_id)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", timeline_height);

    sliders.append("text")
        .classed("slider-text", true)
        .attr("id", d => d.event_id)
        .attr("x", 0)
        .attr("y", timeline_height * 3.2)
        .text(d => format_date(date(d.slider_day)));

    sliders.append("polygon")
        .classed("slider-pointer-right", true)
        .attr("points", `${timeline_height * 2} ${-timeline_height}, 
                         ${timeline_height * 2 + 5} 0, 
                         ${timeline_height * 2} ${timeline_height}`);
    sliders.append("polygon")
        .classed("slider-pointer-left", true)
        .attr("points", `${-timeline_height * 2} ${-timeline_height}, 
                         ${-timeline_height * 2 - 5} 0, ${-timeline_height * 2} 
                         ${timeline_height}`);

    sliders.append("circle")
        .classed("slider-target", true)
        .attr("id", d => d.event_id)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", timeline_height * 5);

    sliders.call(d3.drag()
        .on("drag", (event, d) => {
            const id = event.subject.event_id;
            if (!d3.select("g.slider-sect#" + id).classed("locked")) {;
                d3.select(".submit-btn#" + id).classed("locked", false);
                return (d.slider_day = Math.max(x.domain()[0], Math.min(x.domain()[1], x.invert(event.x - margin.left))));
            }
        })
        .on("drag.update", update_drag));
}

// update the position + visability of things based on drag position
const update_drag = () => {
    d3.selectAll("g.slider-sect")
        .attr("transform", d => `translate(${margin.left + x(d.slider_day)}, ${sect_height / 2})`);

    d3.selectAll("text.slider-text")
        .text(d => format_date(date(d.slider_day)));

    d3.selectAll("polygon.slider-pointer-left")
        .style("display", d => (d.slider_day > x.domain()[0]) ? "initial" : "none");

    d3.selectAll("polygon.slider-pointer-right")
        .style("display", d => (d.slider_day < x.domain()[1]) ? "initial" : "none");
}

// resize chart on page size change
const resize = () => {

    x.range([0, $("#trump-timeline-container").width() - margin.right - margin.left]);

    d3.selectAll(".timeline")
        .attr("width", x.range()[1]);

    d3.selectAll(".timeline-tick")
        .attr("x", d => x(date.invert(d)) - tick_dim[0] / 2)

    d3.selectAll("g.slider-sect")
        .attr("transform", d => `translate(${margin.left + x(d.slider_day)}, ${sect_height / 2})`);

    d3.selectAll("g.answer-sect")
        .attr("transform", d => `translate(${margin.left + x(d.event_day)}, ${sect_height / 2})`);
}

/*********************************/
/*** PARSE DATA AND INIT PLOTS ***/
/*********************************/

d3.csv("/assets/data/trump-timeline.csv", (d) => {
    return {
        event_id: d.event_id,
        event_description: d.event_description,
        event_date: new Date(d.event_date),
        event_day: +date.invert(new Date(d.event_date)).toFixed(0),
        slider_day: d3.randomInt(x.domain()[1])(),
        order: Math.random()
    };
}).then((d) => {
    console.log(d);
    d.sort((a, b) => d3.descending(a.order, b.order)); // sort it in some random order
    init_sects(d); // draw initial bars
});

/*********************************/
/*** PAGE AND BUTTON LISTENERS ***/
/*********************************/

$(window).resize(resize);

d3.select("p#view-more span").on("click", () => {
    d3.selectAll("#trump-timeline-container div").classed("hidden", false);
    d3.select("p#view-more").remove();
})

</script>


