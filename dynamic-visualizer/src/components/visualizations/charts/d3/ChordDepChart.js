const data = [
    {"source": "analytics.cluster", "target": "animate", "value": 2}, {"source": "analytics.cluster", "target": "vis.data", "value": 8}, {
        "source": "analytics.cluster", "target": "util.math", "value": 2
    }, {"source": "analytics.cluster", "target": "analytics.cluster", "value": 5}, {"source": "analytics.cluster", "target": "util", "value": 3}, {
        "source": "analytics.cluster",
        "target": "vis.operator",
        "value": 1
    }, {"source": "analytics.graph", "target": "animate", "value": 5}, {"source": "analytics.graph", "target": "vis.data", "value": 14}, {
        "source": "analytics.graph",
        "target": "util",
        "value": 5
    }, {"source": "analytics.graph", "target": "vis.operator", "value": 6}, {"source": "analytics.graph", "target": "analytics.graph", "value": 1}, {
        "source": "analytics.graph",
        "target": "util.heap",
        "value": 2
    }, {"source": "analytics.graph", "target": "vis", "value": 1}, {"source": "analytics.optimization", "target": "animate", "value": 1}, {
        "source": "analytics.optimization",
        "target": "util",
        "value": 2
    }, {"source": "analytics.optimization", "target": "vis.data", "value": 1}, {"source": "analytics.optimization", "target": "scale", "value": 1}, {
        "source": "analytics.optimization",
        "target": "vis.axis",
        "value": 1
    }, {"source": "analytics.optimization", "target": "vis", "value": 1}, {"source": "analytics.optimization", "target": "vis.operator", "value": 1}, {
        "source": "animate",
        "target": "animate",
        "value": 30
    }, {"source": "animate", "target": "util", "value": 9}, {"source": "animate.interpolate", "target": "util", "value": 2}, {
        "source": "animate.interpolate",
        "target": "animate.interpolate",
        "value": 16
    }, {"source": "animate", "target": "animate.interpolate", "value": 1}, {"source": "data.converters", "target": "data.converters", "value": 7}, {
        "source": "data.converters",
        "target": "data",
        "value": 17
    }, {"source": "data.converters", "target": "util", "value": 1}, {"source": "data", "target": "data", "value": 7}, {"source": "data", "target": "util", "value": 1}, {
        "source": "data",
        "target": "data.converters",
        "value": 2
    }, {"source": "display", "target": "display", "value": 3}, {"source": "display", "target": "util", "value": 1}, {"source": "flex", "target": "display", "value": 1}, {
        "source": "flex",
        "target": "data",
        "value": 1
    }, {"source": "flex", "target": "vis", "value": 1}, {"source": "flex", "target": "vis.axis", "value": 2}, {"source": "flex", "target": "vis.data", "value": 1}, {
        "source": "physics",
        "target": "physics",
        "value": 22
    }, {"source": "query", "target": "query", "value": 61}, {"source": "query", "target": "util", "value": 6}, {
        "source": "query.methods",
        "target": "query.methods",
        "value": 39
    }, {"source": "query.methods", "target": "query", "value": 32}, {"source": "scale", "target": "scale", "value": 19}, {"source": "scale", "target": "util", "value": 14}, {
        "source": "util",
        "target": "util",
        "value": 23
    }, {"source": "util.heap", "target": "util.heap", "value": 2}, {"source": "util.math", "target": "util.math", "value": 2}, {
        "source": "util.palette",
        "target": "util.palette",
        "value": 3
    }, {"source": "util.palette", "target": "util", "value": 2}, {"source": "vis.axis", "target": "animate", "value": 3}, {"source": "vis.axis", "target": "vis", "value": 2}, {
        "source": "vis.axis",
        "target": "scale",
        "value": 4
    }, {"source": "vis.axis", "target": "util", "value": 3}, {"source": "vis.axis", "target": "display", "value": 5}, {"source": "vis.axis", "target": "vis.axis", "value": 7}, {
        "source": "vis.controls",
        "target": "vis.controls",
        "value": 12
    }, {"source": "vis.controls", "target": "vis", "value": 3}, {"source": "vis.controls", "target": "vis.operator.layout", "value": 1}, {
        "source": "vis.controls",
        "target": "vis.events",
        "value": 4
    }, {"source": "vis.controls", "target": "util", "value": 3}, {"source": "vis.controls", "target": "vis.data", "value": 2}, {
        "source": "vis.controls",
        "target": "animate",
        "value": 2
    }, {"source": "vis.controls", "target": "display", "value": 1}, {"source": "vis.data", "target": "vis.data", "value": 26}, {"source": "vis.data", "target": "util", "value": 17}, {
        "source": "vis.data",
        "target": "vis.events",
        "value": 4
    }, {"source": "vis.data", "target": "data", "value": 3}, {"source": "vis.data", "target": "animate", "value": 2}, {"source": "vis.data", "target": "util.math", "value": 2}, {
        "source": "vis.data",
        "target": "display",
        "value": 1
    }, {"source": "vis.data", "target": "vis.data.render", "value": 4}, {"source": "vis.data.render", "target": "vis.data", "value": 5}, {
        "source": "vis.data.render",
        "target": "vis.data.render",
        "value": 3
    }, {"source": "vis.data.render", "target": "util", "value": 3}, {"source": "vis.data", "target": "scale", "value": 9}, {
        "source": "vis.data",
        "target": "util.heap",
        "value": 2
    }, {"source": "vis.events", "target": "vis.data", "value": 6}, {"source": "vis.events", "target": "vis.events", "value": 1}, {
        "source": "vis.events",
        "target": "animate",
        "value": 1
    }, {"source": "vis.legend", "target": "animate", "value": 1}, {"source": "vis.legend", "target": "vis.data", "value": 1}, {
        "source": "vis.legend",
        "target": "util.palette",
        "value": 5
    }, {"source": "vis.legend", "target": "scale", "value": 4}, {"source": "vis.legend", "target": "vis.legend", "value": 4}, {
        "source": "vis.legend",
        "target": "display",
        "value": 6
    }, {"source": "vis.legend", "target": "util", "value": 6}, {"source": "vis.operator.distortion", "target": "vis.operator.distortion", "value": 2}, {
        "source": "vis.operator.distortion",
        "target": "animate",
        "value": 1
    }, {"source": "vis.operator.distortion", "target": "vis.data", "value": 2}, {"source": "vis.operator.distortion", "target": "vis.events", "value": 1}, {
        "source": "vis.operator.distortion",
        "target": "vis.axis",
        "value": 2
    }, {"source": "vis.operator.distortion", "target": "vis.operator.layout", "value": 1}, {"source": "vis.operator.encoder", "target": "animate", "value": 3}, {
        "source": "vis.operator.encoder",
        "target": "scale",
        "value": 3
    }, {"source": "vis.operator.encoder", "target": "vis.operator.encoder", "value": 4}, {"source": "vis.operator.encoder", "target": "util.palette", "value": 7}, {
        "source": "vis.operator.encoder",
        "target": "vis.data",
        "value": 8
    }, {"source": "vis.operator.encoder", "target": "vis.operator", "value": 2}, {"source": "vis.operator.encoder", "target": "util", "value": 3}, {
        "source": "vis.operator.filter",
        "target": "animate",
        "value": 3
    }, {"source": "vis.operator.filter", "target": "vis.data", "value": 10}, {"source": "vis.operator.filter", "target": "vis.operator", "value": 3}, {
        "source": "vis.operator.filter",
        "target": "util",
        "value": 1
    }, {"source": "vis.operator", "target": "animate", "value": 7}, {"source": "vis.operator", "target": "vis", "value": 3}, {
        "source": "vis.operator",
        "target": "vis.operator",
        "value": 11
    }, {"source": "vis.operator.label", "target": "animate", "value": 1}, {"source": "vis.operator.label", "target": "vis.data", "value": 6}, {
        "source": "vis.operator.label",
        "target": "display",
        "value": 3
    }, {"source": "vis.operator.label", "target": "vis.operator", "value": 1}, {"source": "vis.operator.label", "target": "util", "value": 5}, {
        "source": "vis.operator.label",
        "target": "vis.operator.label",
        "value": 2
    }, {"source": "vis.operator.layout", "target": "scale", "value": 6}, {"source": "vis.operator.layout", "target": "vis.data", "value": 34}, {
        "source": "vis.operator.layout",
        "target": "vis.axis",
        "value": 4
    }, {"source": "vis.operator.layout", "target": "util", "value": 20}, {"source": "vis.operator.layout", "target": "vis.operator.layout", "value": 14}, {
        "source": "vis.operator.layout",
        "target": "animate",
        "value": 6
    }, {"source": "vis.operator.layout", "target": "vis.operator", "value": 2}, {"source": "vis.operator.layout", "target": "vis.data.render", "value": 1}, {
        "source": "vis.operator.layout",
        "target": "physics",
        "value": 3
    }, {"source": "vis.operator.layout", "target": "vis", "value": 1}, {"source": "vis.operator", "target": "util", "value": 5}, {
        "source": "vis.operator",
        "target": "vis.data",
        "value": 1
    }, {"source": "vis", "target": "animate", "value": 3}, {"source": "vis", "target": "vis.operator", "value": 2}, {"source": "vis", "target": "vis.events", "value": 2}, {
        "source": "vis",
        "target": "vis.data",
        "value": 2
    }, {"source": "vis", "target": "vis.axis", "value": 2}, {"source": "vis", "target": "util", "value": 1}, {"source": "vis", "target": "vis.controls", "value": 1}];


function ChordDepChart() {


    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    const chords = chord(matrix);

    const group = svg.append("g")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .selectAll("g")
        .data(chords.groups)
        .join("g");

    group.append("path")
        .attr("fill", d => color(names[d.index]))
        .attr("d", arc);

    group.append("text")
        .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
        .attr("dy", "0.35em")
        .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => names[d.index]);

    group.append("title")
        .text(d => `${names[d.index]}
${d3.sum(chords, c => (c.source.index === d.index) * c.source.value)} outgoing →
${d3.sum(chords, c => (c.target.index === d.index) * c.source.value)} incoming ←`);

    svg.append("g")
        .attr("fill-opacity", 0.75)
        .selectAll("path")
        .data(chords)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => color(names[d.target.index]))
        .attr("d", ribbon)
        .append("title")
        .text(d => `${names[d.source.index]} → ${names[d.target.index]} ${d.source.value}`);

    return svg.node();
}
