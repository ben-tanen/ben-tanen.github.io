    function animate_brain() {
        var available_lines = brain_svg.selectAll('line:not(.tbd):not(.brain-border)');

        if (available_lines.size() == 0) return;

        var ix = Math.floor(Math.random() * available_lines.size());

        var l1 = d3.select(available_lines._groups[0][ix]);
        var l2 = brain_svg.append('line')
            .attr('x1', l1.attr('x2'))
            .attr('y1', l1.attr('y2'))
            .attr('x2', l1.attr('x2'))
            .attr('y2', l1.attr('y2'));

        var x1 = l1.attr('x1'),
            y1 = l1.attr('y1');

        l2.transition().duration(1000).delay(200)
            .attr('x1', x1)
            .attr('y1', y1);

        l1.transition().duration(1000)
            .attr('x2', x1)
            .attr('y2', y1)
            .transition().delay(2000)
            .remove();
    }

    var brain_svg = d3.select('#brain-viz');
    var lines = brain_svg.selectAll('line'),
        dots  = brain_svg.selectAll('circle');

    var brain_interval = setInterval(function() {
        animate_brain();
    }, 200);

    $(window).blur(function() {
        clearInterval(brain_interval);
    });

    $(window).focus(function() {
        brain_interval = setInterval(function() {
            animate_brain();
        }, 200);
    });
