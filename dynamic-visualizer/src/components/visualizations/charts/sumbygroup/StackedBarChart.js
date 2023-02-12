import * as d3 from "d3";

import useD3 from "../helper/useD3";
import useGetData from "../../../../api_crud/useGetData";
import {getRequestUrl, uniqueId} from "../../../../helper/generalHelper";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-bar-chart
// Wurde angepasst zu einer React Komponente.
export default function StackedBarChart(props) {

    // Data
    const {response, loading} = useGetData(getRequestUrl(props));
    const data = response;
    const id = uniqueId();

    // Configurations
    let x = d => d.id // given d in data, returns the (categorical) z-value
    let y = d => d.count // given d in data, returns the (quantitative) y-value
    let z = d => d.group; // given d in data, returns the (ordinal) x-value
    let title // given d in data, returns the title text
    let marginTop = 30 // top margin, in pixels
    let marginRight = 0 // right margin, in pixels
    let marginBottom = 30 // bottom margin, in pixels
    let marginLeft = 40 // left margin, in pixels
    let width = 1200 // outer width, in pixels
    let height = 800 // outer height, in pixels
    let xDomain = d3.groupSort(data, D => d3.sum(D, d => -d.count), d => d.id) // array of x-values, sortierung
    let xRange = [marginLeft, width - marginRight] // [left, right]
    let xPadding = 0.1 // amount of x-range to reserve to separate bars
    let yType = d3.scaleLinear // type of y-scale
    let yDomain // [ymin, ymax]
    let yRange = [height - marginBottom, marginTop] // [bottom, top]
    let zDomain;  // array of z-values
    let offset = d3.stackOffsetDiverging // stack offset method
    let order = d3.stackOrderNone // stack order method
    let yFormat // a format specifier string for the y-axis
    let yLabel = props.label // a label for the y-axis
    let colors = d3.schemeTableau10 // array of colors

    const ref = useD3(
        (svg) => {

            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);
            const Z = d3.map(data, z);

            // Compute default x- and z-domains, and unique them.
            if (xDomain === undefined) xDomain = X;
            if (zDomain === undefined) zDomain = Z;
            xDomain = new d3.InternSet(xDomain);
            zDomain = new d3.InternSet(zDomain);


            // Omit any data not present in the x- and z-domains.
            const I = d3.range(X.length).filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));

            // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
            // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
            // each tuple has an i (index) property so that we can refer back to the
            // original data point (data[i]). This code assumes that there is only one
            // data point for a given unique x- and z-value.
            const series = d3.stack()
                .keys(zDomain)
                .value(([x, I], z) => Y[I.get(z)])
                .order(order)
                .offset(offset)
                (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
                .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

            // Compute the default y-domain. Note: diverging stacks can be negative.
            if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

            // Construct scales, axes, and formats.
            const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
            const yScale = yType(yDomain, yRange);
            const color = d3.scaleOrdinal(zDomain, colors);
            const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
            const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

            // Compute titles.
            if (title === undefined) {
                const formatValue = yScale.tickFormat(100, yFormat);
                title = i => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
            } else {
                const O = d3.map(data, d => d);
                const T = title;
                title = i => T(O[i], i, data);
            }

            svg = d3.select("#" + id)
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(yLabel));

            const bar = svg.append("g")
                .selectAll("g")
                .data(series)
                .join("g")
                .attr("fill", ([{i}]) => color(Z[i]))
                .selectAll("rect")
                .data(d => d)
                .join("rect")
                .attr("x", ({i}) => xScale(X[i]))
                .attr("y", ([y1, y2]) => Math.min(yScale(y1), yScale(y2)))
                .attr("height", ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
                .attr("width", xScale.bandwidth());

            if (title) bar.append("title")
                .text(({i}) => title(i));

            svg.append("g")
                .attr("transform", `translate(0,${770})`)
                .call(xAxis);

            return Object.assign(svg.node(), {scales: {color}});

        },
        [response]
    );

    return (
        <svg id={id} ref={ref}/>
    )

}
