import * as d3 from "d3";

import useD3 from "../helper/useD3";
import useGetData from "../../../../api_crud/useGetData";
import {getRequestUrl, uniqueId} from "../../../../helper/generalHelper";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart
// Wurde angepasst zu einer React Komponente.
export default function BarChart(props) {

    // Data
    const {response, loading} = useGetData(getRequestUrl(props));
    const data = response;
    const id = uniqueId();

    // Configurations
    let x = x => x.id // given d in data, returns the (ordinal) x-value
    let y = y => y.count // given d in data, returns the (quantitative) y-value
    let title // given d in data, returns the title text
    let marginTop = 20 // the top margin, in pixels
    let marginRight = 0 // the right margin, in pixels
    let marginBottom = 30 // the bottom margin, in pixels
    let marginLeft = 40 // the left margin, in pixels
    let width = 1200 // the outer width of the chart, in pixels
    let height = 800 // the outer height of the chart, in pixels
    let xDomain // an array of (ordinal) x-values
    let xRange = [marginLeft, width - marginRight] // [left, right]
    let yType = d3.scaleLinear // y-scale type
    let yDomain // [ymin, ymax]
    let yRange = [height - marginBottom, marginTop] // [bottom, top]
    let xPadding = 0.1 // amount of x-range to reserve to separate bars
    let yFormat // a format specifier string for the y-axis
    let yLabel = props.label // a label for the y-axis
    let color = "steelblue" // bar fill color

    const ref = useD3(
        (svg) => {

            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);

            // Compute default domains, and unique the x-domain.
            if (xDomain === undefined) xDomain = X;
            if (yDomain === undefined) yDomain = [0, d3.max(Y)];
            xDomain = new d3.InternSet(xDomain);

            // Omit any data not present in the x-domain.
            const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

            // Construct scales, axes, and formats.
            const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
            const yScale = yType(yDomain, yRange);
            const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
            const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

            // Compute titles.
            if (title === undefined) {
                const formatValue = yScale.tickFormat(100, yFormat);
                title = i => `${X[i]}\n${formatValue(Y[i])}`;
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
                .attr("fill", color)
                .selectAll("rect")
                .data(I)
                .join("rect")
                .attr("x", i => xScale(X[i]))
                .attr("y", i => yScale(Y[i]))
                .attr("height", i => yScale(0) - yScale(Y[i]))
                .attr("width", xScale.bandwidth());

            if (title) bar.append("title")
                .text(title);

            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(xAxis);

            return svg.node();
        },
        [response]
    );

    return (
        <svg id={id} ref={ref}/>
    )
}
