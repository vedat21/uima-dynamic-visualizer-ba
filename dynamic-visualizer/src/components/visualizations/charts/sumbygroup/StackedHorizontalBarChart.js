import * as d3 from "d3";

import useD3 from "../helper/useD3";
import useGetData from "../../../../api_crud/useGetData";
import {getRequestUrl, uniqueId} from "../../../../helper/generalHelper";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-bar-chart
// Angepasst zu einer React Komponente
export default function StackedHorizontalBarChart(props) {

    // Data
    const {response, loading} = useGetData(getRequestUrl(props));
    const data = response;
    const id = uniqueId();

    // Configurations
    let x = d => d.count // given d in data, returns the (categorical) z-value
    let y = d => d.id // given d in data, returns the (quantitative) y-value
    let z = d => d.group; // given d in data, returns the (ordinal) x-value
    let title; // given d in data, returns the title text
    let marginTop = 30; // top margin, in pixels
    let marginRight = 10; // right margin, in pixels
    let marginBottom = 0; // bottom margin, in pixels
    let marginLeft = 100; // left margin, in pixels
    let width = 1300; // outer width, in pixels
    let height = 800; // outer height, in pixels
    let xType = d3.scaleLinear; // type of x-scale
    let xDomain;
    let xRange = [marginLeft, width - marginRight]; // [left, right]
    let yDomain = d3.groupSort(data, D => d3.sum(D, d => d.count), d => d.id); // array of x-values, Sortierung
    let yRange; // [bottom, top]
    let yPadding = 0.1; // amount of y-range to reserve to separate bars
    let zDomain; // array of z-values
    let offset = d3.stackOffsetDiverging; // stack offset method
    let order = d3.stackOrderNone; // stack order method
    let xFormat; // a format specifier string for the x-axis
    let xLabel = props.label; // a label for the x-axis
    let colors = d3.schemeTableau10; // array of colors

    const ref = useD3(
        (svg) => {

            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);
            const Z = d3.map(data, z);

            // Compute default y- and z-domains, and unique them.
            if (yDomain === undefined) yDomain = Y;
            if (zDomain === undefined) zDomain = Z;
            yDomain = new d3.InternSet(yDomain);
            zDomain = new d3.InternSet(zDomain);

            // Omit any data not present in the y- and z-domains.
            const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

            // If the height is not specified, derive it from the y-domain.
            if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
            if (yRange === undefined) yRange = [height - marginBottom, marginTop];

            // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
            // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
            // each tuple has an i (index) property so that we can refer back to the
            // original data point (data[i]). This code assumes that there is only one
            // data point for a given unique y- and z-value.
            const series = d3.stack()
                .keys(zDomain)
                .value(([, I], z) => X[I.get(z)])
                .order(order)
                .offset(offset)
                (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
                .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

            // Compute the default x-domain. Note: diverging stacks can be negative.
            if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

            // Construct scales, axes, and formats.
            const xScale = xType(xDomain, xRange);
            const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
            const color = d3.scaleOrdinal(zDomain, colors);
            const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
            const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

            // Compute titles.
            if (title === undefined) {
                const formatValue = xScale.tickFormat(100, xFormat);
                title = i => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
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

            const bar = svg.append("g")
                .selectAll("g")
                .data(series)
                .join("g")
                .attr("fill", ([{i}]) => color(Z[i]))
                .selectAll("rect")
                .data(d => d)
                .join("rect")
                .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
                .attr("y", ({i}) => yScale(Y[i]))
                .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
                .attr("height", yScale.bandwidth());

            if (title) bar.append("title")
                .text(({i}) => title(i));

            svg.append("g")
                .attr("transform", `translate(100,0)`)
                .call(yAxis);

            return Object.assign(svg.node(), {scales: {color}});
        },
        [response]
    );

    return (
        <svg id={id} ref={ref}/>
    )

}
