import * as d3 from "d3";
import useD3 from "./helper/useD3";
import {apiEndpoints} from "../../../helper/envConst";
import useGetData from "../../../api_crud/useGetData";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/area-chart
// Wurde angepasst zu einer React Komponente.
export default function AreaChartD3(props) {

    let requestUrl = props.url + props.selectedDocuments.join(",")
        + apiEndpoints.requestParamMinOccurrence + props.limit;
    if (props.lemmaEnd !== 0 && props.selectedDocuments.length === 1) {
        requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end="
            + props.lemmaEnd;
    }
    // make request to get data
    const {response, loading} = useGetData(requestUrl);
    const data = response;

    let x = d => d.id // given d in data, returns the (temporal) x-value
    let y = d => d.count // given d in data, returns the (quantitative) y-value
    let defined // given d in data, returns true if defined (for gaps)
    let curve = d3.curveLinear // method of interpolation between points
    let marginTop = 20 // top margin, in pixels
    let marginRight = 30 // right margin, in pixels
    let marginBottom = 30 // bottom margin, in pixels
    let marginLeft = 40 // left margin, in pixels
    let width = 640 // outer width, in pixels
    let height = 400 // outer height, in pixels
    let xType = d3.scaleUtc // type of x-scale
    let xDomain // [xmin, xmax]
    let xRange = [marginLeft, width - marginRight] // [left, right]
    let yType = d3.scaleLinear // type of y-scale
    let yDomain // [ymin, ymax]
    let yRange = [height - marginBottom, marginTop] // [bottom, top]
    let yFormat // a format specifier string for the y-axis
    let yLabel = "was" // a label for the y-axis
    let color = "steelblue" // fill color of area

    // create unique id to select with d3 and reference with react
    // const rnd from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15456423
    const rnd = (len,
                 chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => [...Array(
        len)].map(
        () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
    const id = rnd(15);

    const ref = useD3(
        (svg) => {
            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);
            const I = d3.range(X.length);

            // Compute which data points are considered defined.
            if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
            const D = d3.map(data, defined);

            // Compute default domains.
            if (xDomain === undefined) xDomain = d3.extent(X);
            if (yDomain === undefined) yDomain = [0, d3.max(Y)];

            // Construct scales and axes.
            const xScale = xType(xDomain, xRange);
            const yScale = yType(yDomain, yRange);
            const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
            const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

            // Construct an area generator.
            const area = d3.area()
                .defined(i => D[i])
                .curve(curve)
                .x(i => xScale(X[i]))
                .y0(yScale(0))
                .y1(i => yScale(Y[i]));

             svg = d3.select("#"+id)
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

            svg.append("path")
                .attr("fill", color)
                .attr("d", area(I));

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
