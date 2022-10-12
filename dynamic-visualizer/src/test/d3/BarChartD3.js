import * as d3 from "d3";
import {useEffect, useRef} from "react";

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/horizontal-bar-chart


const alphapeb = [{"letter": "A", "frequency": 0.08167},
  {"letter": "B", "frequency": 0.01492}, {"letter": "C", "frequency": 0.02782},
  {"letter": "D", "frequency": 0.04253}, {"letter": "E", "frequency": 0.12702},
  {"letter": "F", "frequency": 0.02288}, {"letter": "G", "frequency": 0.02015},
  {"letter": "H", "frequency": 0.06094}, {"letter": "I", "frequency": 0.06966},
  {"letter": "J", "frequency": 0.00153}, {"letter": "K", "frequency": 0.00772},
  {"letter": "L", "frequency": 0.04025}, {"letter": "M", "frequency": 0.02406},
  {"letter": "N", "frequency": 0.06749}, {"letter": "O", "frequency": 0.07507},
  {"letter": "P", "frequency": 0.01929}, {"letter": "Q", "frequency": 0.00095},
  {"letter": "R", "frequency": 0.05987}, {"letter": "S", "frequency": 0.06327},
  {"letter": "T", "frequency": 0.09056}, {"letter": "U", "frequency": 0.02758},
  {"letter": "V", "frequency": 0.00978}, {"letter": "W", "frequency": 0.0236},
  {"letter": "X", "frequency": 0.0015}, {"letter": "Y", "frequency": 0.01974},
  {"letter": "Z", "frequency": 0.00074}]

export default function BarChartD3({
  x = d => d, // given d in data, returns the (quantitative) x-value
  y = (d, i) => i, // given d in data, returns the (ordinal) y-value
  title, // given d in data, returns the title text
  marginTop = 30, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 10, // the bottom margin, in pixels
  marginLeft = 30, // the left margin, in pixels
  width = 600, // the outer width of the chart, in pixels
  height , // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  xFormat, // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  yPadding = 0.1, // amount of y-range to reserve to separate bars
  yDomain, // an array of (ordinal) y-values
  yRange, // [top, bottom]
  color = "currentColor", // bar fill color
  titleColor = "white", // title fill color when atop bar
  titleAltColor = "currentColor", // title fill color when atop background
} = {}) {

  const ref = useRef();

  // Compute values.
  const X = d3.map(alphapeb, x);
  const Y = d3.map(alphapeb, y);

  // Compute default domains, and unique the y-domain.
  if (xDomain === undefined) {
    xDomain = [0, d3.max(X)];
  }
  if (yDomain === undefined) {
    yDomain = Y;
  }
  yDomain = new d3.InternSet(yDomain);

  // Omit any data not present in the y-domain.
  const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

  // Compute the default height.
  if (height === undefined) {
    height = Math.ceil((yDomain.size + yPadding) * 25)
        + marginTop + marginBottom;
  }
  if (yRange === undefined) {
    yRange = [marginTop, height - marginBottom];
  }

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
    const O = d3.map(alphapeb, d => d);
    const T = title;
    title = i => T(O[i], i, alphapeb);
  }

  useEffect(() => {


    const svg = d3.select(ref.current)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
//    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .call(xAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
    .attr("y2", height - marginTop - marginBottom)
    .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
    .attr("x", width)
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

  }, [])

  return (
      <svg
          viewBox="0 0 300 600"
          ref={ref}
      />
  )
}