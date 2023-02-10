import * as d3 from "d3";

import useD3 from "./helper/useD3";
import {apiEndpoints} from "../../../helper/envConst";
import useGetData from "../../../api_crud/useGetData";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bar-chart
// Angepasst zu einer React Komponente
export default function HorizontalBarChart(props) {

    let requestUrl = props.url + props.selectedDocuments.join(",") + apiEndpoints.requestParamLimit + props.limit;
    if (props.lemmaEnd != 0 && props.selectedDocuments.length == 1) {
        requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end=" + props.lemmaEnd;
    }
    // make request to get data
    const {response, loading} = useGetData(requestUrl);
    const data = response;
    // create unique id to select with d3 and reference with react
    // const rnd from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15456423
    const rnd = (len, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
    const id = rnd(15);

    let x = x => x.count // given d in data, returns the (ordinal) x-value
    let y = y => y.id // given d in data, returns the (quantitative) y-value
    let title // given d in data, returns the title text
    let marginTop = 30 // the top margin, in pixels
    let marginRight = 0 // the right margin, in pixels
    let marginBottom = 10 // the bottom margin, in pixels
    let marginLeft = 50 // the left margin, in pixels
    let width = 1200 // the outer width of the chart, in pixels
    let height = 800; // outer height, in pixels
    let xType = d3.scaleLinear; // type of x-scale
    let xDomain; // [xmin, xmax]
    let xRange = [marginLeft, width - marginRight]; // [left, right]
    let xFormat; // a format specifier string for the x-axis
    let xLabel; // a label for the x-axis
    let yPadding = 0.1; // amount of y-range to reserve to separate bars
    let yDomain; // an array of (ordinal) y-values
    let yRange; // [top, bottom]
    let color = "steelblue"; // bar fill color
    let titleColor = "white"; // title fill color when atop bar
    let titleAltColor = "white"; // title fill color when atop background

    const ref = useD3(
        (svg) => {

            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);

            // Compute default domains, and unique the y-domain.
            if (xDomain === undefined) xDomain = [0, d3.max(X)];
            if (yDomain === undefined) yDomain = Y;
            yDomain = new d3.InternSet(yDomain);

            // Omit any data not present in the y-domain.
            const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

            // Compute the default height.
            if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
            if (yRange === undefined) yRange = [marginTop, height - marginBottom];

            // Construct scales and axes.
            const xScale = xType(xDomain, xRange);
            const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
            const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
            const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

            // Compute titles.
            if (title === undefined) {
                const formatValue = xScale.tickFormat(100, xFormat);
                title = i => `${formatValue(X[i])}`;
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
                .attr("transform", `translate(0,${marginTop})`)
                .call(xAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", height - marginTop - marginBottom)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", width - marginRight)
                    .attr("y", -22)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(xLabel));

            svg.append("g")
                .attr("fill", color)
                .selectAll("rect")
                .data(I)
                .join("rect")
                .attr("x", xScale(0))
                .attr("y", i => yScale(Y[i]))
                .attr("width", i => xScale(X[i]) - xScale(0))
                .attr("height", yScale.bandwidth());

            svg.append("g")
                .attr("fill", titleColor)
                .attr("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .selectAll("text")
                .data(I)
                .join("text")
                .attr("x", i => xScale(X[i]))
                .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
                .attr("dy", "0.35em")
                .attr("dx", -4)
                .text(title)
                .call(text => text.filter(i => xScale(X[i]) - xScale(0) < 20) // short bars
                    .attr("dx", +4)
                    .attr("fill", titleAltColor)
                    .attr("text-anchor", "start"));

            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(yAxis);

            return svg.node();
        },
        [response]
    );

    return (
        <svg id={id} ref={ref}/>
    )
}
