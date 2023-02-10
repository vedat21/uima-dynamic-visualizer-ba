import * as d3 from "d3";
import useD3 from "./helper/useD3";
import {apiEndpoints} from "../../../helper/envConst";
import useGetData from "../../../api_crud/useGetData";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-area-chart
export default function StackedAreaChart(props) {

  let requestUrl = props.url + props.selectedDocuments.join(",")
      + apiEndpoints.requestParamLimit + props.limit;
  if (props.lemmaEnd !== 0 && props.selectedDocuments.length === 1) {
    requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end="
        + props.lemmaEnd;
  }
  // make request to get data
  const {response, loading} = useGetData(requestUrl);

  // create unique id to select with d3 and reference with react
  // const rnd from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15456423
  const rnd = (len,
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => [...Array(
      len)].map(
      () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
  const id = rnd(15);

  const x = d => d3.timeParse("%d.%m.%Y")(d.date);
  const y = d => d.count;
  const z = d => d.id;
  const marginTop = 20; // top margin, in pixels
  const marginRight = 30; // right margin, in pixels
  const marginBottom = 30; // bottom margin, in pixels
  const marginLeft = 40; // left margin, in pixels
  const width = 640; // outer width, in pixels
  const height = 400; // outer height, in pixels
  const xType = d3.scaleUtc // type of x-scale
  const xRange = [marginLeft, width - marginRight]; // [left, right]
  const yType = d3.scaleLinear; // type of y-scale
  const yRange = [height - marginBottom, marginTop]; // [bottom, top]
  const offset = d3.stackOffsetDiverging; // stack offset method
  const order = d3.stackOrderNone; // stack order method
  let xFormat; // a format specifier string for the x-axis
  let yFormat; // a format specifier for the y-axis
 // let yLabel = props.url.split("sumbydate?types=")[1] !== null ?  props.url.split("sumbydate?types=")[1].split("&names")[0] : "Title" // a label for the y-axis
  let yLabel = props.label
    const colors = d3.schemeTableau10; // array of colors for z

  const ref = useD3(
      (svg) => {

        // display only data that is in more than one dataset
        const data = response.filter(item => response.filter(x => x.id === item.id).length > 1);

        // Compute values.
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
        const Z = d3.map(data, z);

        // Compute default x- and z-domains, and unique the z-domain.
        const xDomain = d3.extent(X);
        let zDomain = Z;
        zDomain = new d3.InternSet(zDomain);

        // Omit any data not present in the z-domain.
        const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

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
         const yDomain = d3.extent(series.flat(2));


        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        const color = d3.scaleOrdinal(zDomain, colors);
        const xAxis = d3.axisBottom(xScale).ticks(width / 80,
            xFormat).tickSizeOuter(
            0);
        const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

        const area = d3.area()
        .x(({i}) => xScale(X[i]))
        .y0(([y1]) => yScale(y1))
        .y1(([, y2]) => yScale(y2));

        svg = d3.select("#" + id)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "width: 100%; height: inherit; height: intrinsic;")

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

        svg.append("g")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ([{i}]) => color(Z[i]))
        .attr("d", area)
        .append("title")
        .text(([{i}]) => Z[i]);

        svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);



      },
      [response]
  );
  return (
      <svg id={id} ref={ref}/>
  )

}
