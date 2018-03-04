new jBox('Tooltip', {
  attach: '#footnote-1',
  content: "At the time of me pulling this data and Mr. Hess making this pick, Ezekiel Elliott was due to serve a six-game suspension, making for a risky pick regardless of Elliott's ability. Hess didn't seem to care about that and went with him anyway. Minutes later, it was announced that Elliott would not have to serve the six-game suspension while his case was undergoing an appeal."
});

var sources = ["fifth-down", "fantasy-pros", "mock"]

var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width  = $('#d3-ff').width() - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var ff_svg = d3.select("#d3-ff")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// pull in data
d3.csv("/projects/fantasy-football/data/ag-ff-draft.csv", function(d) {
    d.AG           = +d.AG;
    d.fifth_down   = +d.fifth_down;
    d.mock         = +d.mock;
    d.fantasy_pros = +d.fantasy_pros;
    return d;
}, function(error, data) {
    if (error) throw error;

    // shrinking data if on mobile (so not as much packed all in)
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        data = data.slice(1,60);
    }

    x.domain(d3.extent(data, function(d) { return d.AG;   }));
    y.domain(d3.extent(data, function(d) { return d.mock; })).nice();

    // for each pick, add one dot from each source
    for (let i = 0; i < data.length; i++) {
        ff_svg.append("circle")
            .attr("class", "dot AG")
            .attr("id", `AG-${i}`)
            .attr("r", 2.5)
            .attr("cx", x(data[i].AG))
            .attr("cy", y(data[i].AG))
            .style("fill", `rgba(169,169,169,${data[i].team == "Team Tanen" ? 1 : 0.5})`);

        ff_svg.append("circle")
            .attr("class", "dot fifth-down")
            .attr("id", `fifth-down-${i}`)
            .attr("r", 3.5)
            .attr("cx", x(data[i].AG))
            .attr("cy", y(data[i].fifth_down))
            .style("stroke", "#77BDEE");

        ff_svg.append("circle")
            .attr("class", "dot fantasy-pros")
            .attr("id", `fantasy-pros-${i}`)
            .attr("r", 3.5)
            .attr("cx", x(data[i].AG))
            .attr("cy", y(data[i].fantasy_pros))
            .style("stroke", "#23CE6B");

        ff_svg.append("circle")
            .attr("class", "dot mock")
            .attr("id", `mock-${i}`)
            .attr("r", 3.5)
            .attr("cx", x(data[i].AG))
            .attr("cy", y(data[i].mock))
            .style("stroke", "#FF4CC8");
    }

    // build legend
    ff_svg.append("text")
        .attr("class", "legend-text")
        .attr("id", "player-text")
        .style("font-weight", "bold")
        .attr("transform", "translate(8, 10)")
        .text("Player Name");

    ff_svg.append("text")
        .attr("class", "legend-text")
        .attr("id", "AG-text")
        .attr("transform", "translate(8, 27)")
        .text("Team Name, Pick #X");

    ff_svg.append("text")
        .attr("class", "legend-text")
        .attr("id", "suggested-text")
        .attr("transform", "translate(8, 44)")
        .text("Suggested:");

    ff_svg.append("text")
        .attr("class", "legend-text suggested")
        .attr("id", "fantasy-pros-text")
        .style("fill", "#23ce6b")
        .attr("transform", "translate(90, 44)")
        .text("xxx");

    ff_svg.append("text")
        .attr("class", "legend-text suggested")
        .attr("id", "fifth-down-text")
        .style("fill", "#77bdee")
        .attr("transform", "translate(122, 44)")
        .text("yyy");

    ff_svg.append("text")
        .attr("class", "legend-text suggested")
        .attr("id", "mock-text")
        .style("fill", "#ff4cc8")
        .attr("transform", "translate(154, 44)")
        .text("zzz");

    ff_svg.append("text")
        .attr("class", "legend-text")
        .attr("id", "consensus-text")
        .attr("transform", "translate(122, 61)")
        .text("(Neutral pick)");

    // on hover, highlight corresponding dots and display legend information
    ff_svg.selectAll('.dot')
        .on("mouseover", function() {
            let id = d3.select(this).attr('id'),
                ix = +id.split("-")[id.split("-").length - 1];
            
            ff_svg.select(`#fifth-down-${ix}`).style("fill","#77BDEE");
            ff_svg.select(`#fantasy-pros-${ix}`).style("fill","#23CE6B");
            ff_svg.select(`#mock-${ix}`).style("fill","#FF4CC8");
            ff_svg.select(`#AG-${ix}`).style("stroke","#a9a9a9");

            ff_svg.selectAll('.legend-text').style('display','block')
            ff_svg.select("#player-text").text(data[ix].player);
            ff_svg.select("#AG-text").text(data[ix].team + ", Pick #" + data[ix].AG);
            ff_svg.select("#fantasy-pros-text").text(data[ix].fantasy_pros);
            ff_svg.select("#fifth-down-text").text(data[ix].fifth_down);
            ff_svg.select("#mock-text").text(data[ix].mock);

            let average_rank = ((sources.indexOf('fantasy-pros') >= 0 ? data[ix].fantasy_pros : 0) +
                                (sources.indexOf('fifth-down')   >= 0 ? data[ix].fifth_down : 0) +
                                (sources.indexOf('mock')         >= 0 ? data[ix].mock : 0)) / sources.length;
            if (average_rank >= data[ix].AG + 1.5)      var consensus_rating = "Overrated";
            else if (average_rank <= data[ix].AG - 1.5) var consensus_rating = "Underrated";
            else                                        var consensus_rating = "Neutral";
            ff_svg.select("#consensus-text").text("(" + consensus_rating + " pick)");
        })
        .on("mouseout", function() {
            ff_svg.selectAll('.dot:not(.AG)').style("fill","none");
            ff_svg.selectAll('.dot.AG').style("stroke","none");
            ff_svg.selectAll(".legend-text").style("display","none");
        });

    // add axes and labels
    ff_svg.append("g")
        .attr("id","x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

    ff_svg.append("g")
        .attr("id","y-axis")
        .call(d3.axisLeft(y).tickValues([0,36,72,108,144,180]));

    ff_svg.append("text")
        .attr("id", "x-axis-text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .text("Actual Pick");

    ff_svg.append("text")
        .attr("id", "y-axis-text")
        .attr("transform", `translate(${-margin.left + 15}, ${height / 2}), rotate(270)`)
        .text("Suggested Pick");

    ff_svg.append("text")
        .attr("id", "direction1-text")
        .attr("transform", `translate(${width * 0.85}, ${height * .20}), rotate(270)`)
        .text("Overvalued \u2192");

    ff_svg.append("text")
        .attr("id", "direction2-text")
        .attr("transform", `translate(${width * 0.85}, ${height * .83}), rotate(270)`)
        .text("\u2190 Undervalued ");

    // shrinking data if on mobile (so not as much packed all in)
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        ff_svg.select("#direction1-text").remove();
        ff_svg.select("#direction2-text").remove();
    }

    // toggle data sources based on what is selected
    function refreshData() {
        sources = sources.sort();

        d3.selectAll('.dot:not(.AG)').style('display', 'none');
        d3.selectAll('text.suggested').attr("transform", "translate(-100,-100)");
        for (source_ix in sources) {
            source = sources[source_ix]
            d3.selectAll('.dot.' + source).style('display', 'initial');
            d3.select('#' + source + '-text').attr("transform", `translate(${[90,122,154][source_ix]}, 44)`);
        }

        // move consensus text based on number of sources
        if (sources.length == 0) d3.select('#consensus-text').attr("transform", "translate(-100,-100)");
        else {
            d3.select('#consensus-text')
                .attr("transform", `translate(${[155, 106, 122][sources.length - 1]}, ${[44, 61, 61][sources.length - 1]})`);
        }

        // move "Suggested:" if no sources selected
        if (sources.length == 0) d3.select('#suggested-text').attr("transform", "translate(-100,-100)");
        else d3.select('#suggested-text').attr("transform", "translate(8,44)");
    }

    // update data source list
    $('#d3-ff-buttons button').click(function() {
        $(this).toggleClass('off');

        let source = $(this).attr('id');
        if (sources.indexOf(source) > -1) sources.splice(sources.indexOf(source), 1);
        else sources.push(source);

        refreshData();
    });

    // make chart resizable
    $(window).resize(function() {
        // update width and scale to match
        width  = $('#d3-ff').width() - margin.left - margin.right;
        x.range([0, width]);

        // move each dot  
        for (var i = 0; i < data.length; i++) {
            ff_svg.selectAll(`#fifth-down-${i}, #fantasy-pros-${i}, #mock-${i}, #AG-${i}`)
                .attr('cx', x(data[i].AG));
        }

        // update axis
        ff_svg.select("#x-axis")
            .call(d3.axisBottom(x).ticks(5));

        ff_svg.select("#x-axis-text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`);

        ff_svg.select("#direction1-text")
            .attr("transform", `translate(${width * 0.85}, ${height * .20}), rotate(270)`);

        ff_svg.select("#direction2-text")
            .attr("transform", `translate(${width * 0.85}, ${height * .83}), rotate(270)`);

    });
});