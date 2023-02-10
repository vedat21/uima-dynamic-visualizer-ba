import * as d3 from "d3";

import useD3 from "./helper/useD3";
import {apiEndpoints} from "../../../helper/envConst";
import useGetData from "../../../api_crud/useGetData";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/pie-chart
// Angepasst zu einer React Komponente
export default function DoughnutChart(props) {

    let requestUrl = props.url + props.selectedDocuments.join(",") + apiEndpoints.requestParamLimit + props.limit;
    if (props.lemmaEnd != 0 && props.selectedDocuments.length == 1) {
        requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end=" + props.lemmaEnd;
    }
    // make request to get data
    const {response, loading} = useGetData(requestUrl);

    // create unique id to select with d3 and reference with react
    // const rnd from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15456423
    const rnd = (len, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
    const id = rnd(15);


    let name = x => x.id; // given d in data, returns the (ordinal) label
    let value = y => y.count; // given d in data, returns the (quantitative) value
    let title; // given d in data, returns the title text
    let width = 1200; // outer width, in pixels
    let height = 800; // outer height, in pixels
    let innerRadius = 200; // inner radius of pie, in pixels (non-zero for donut)
    let outerRadius = Math.min(width, height) / 2; // outer radius of pie, in pixels
    let labelRadius = (innerRadius * 0.2 + outerRadius * 0.7); // center radius of labels
    let format = ","; // a format specifier for values (in the label)
    let names; // array of names (the domain of the color scale)
    let colors; // array of colors for names
    let stroke = innerRadius > 0 ? "none" : "white"; // stroke separating widths
    let strokeWidth = 1; // width of stroke separating wedges
    let strokeLinejoin = "round"; // line join of stroke separating wedges
    let padAngle = stroke === "none" ? 1 / outerRadius : 0; // angular separation between wedges


    const ref = useD3(
        (svg) => {

            const data = response

            // Compute values.
            const N = d3.map(data, name);
            const V = d3.map(data, value);
            const I = d3.range(N.length).filter(i => !isNaN(V[i]));

            // Unique the names.
            if (names === undefined) names = N;
            names = new d3.InternSet(names);

            // Chose a default color scheme based on cardinality.
            if (colors === undefined) colors = d3.schemeSpectral[names.size];
            if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

            // Construct scales.
            const color = d3.scaleOrdinal(names, colors);

            // Compute titles.
            if (title === undefined) {
                const formatValue = d3.format(format);
                title = i => `${N[i]}\n${formatValue(V[i])}`;
            } else {
                const O = d3.map(data, d => d);
                const T = title;
                title = i => T(O[i], i, data);
            }

            // Construct arcs.
            const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
            const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
            const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

            svg = d3.select("#" + id)
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

            svg.append("g")
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linejoin", strokeLinejoin)
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr("fill", d => color(N[d.data]))
                .attr("d", arc)
                .append("title")
                .text(d => title(d.data));

            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 14)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .selectAll("tspan")
                .data(d => {
                    const lines = `${title(d.data)}`.split(/\n/);
                    return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
                })
                .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .text(d => d);

            return Object.assign(svg.node(), {scales: {color}});
        },
        [response]
    );

    return (
        <svg id={id} ref={ref}/>

    )
}
