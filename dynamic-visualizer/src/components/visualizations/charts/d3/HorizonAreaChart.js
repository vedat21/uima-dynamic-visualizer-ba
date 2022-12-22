import * as d3 from "d3";
import useD3 from "../helper/useD3";
import {apiEndpoints} from "../../../../helper/envConst";
import useGetData from "../../../../api_crud/useGetData";


// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-area-chart
// angepasst zu react komponente
export default function HorizonAreaChart(props) {

  let requestUrl = props.url  +   props.selectedDocuments.join(",") + apiEndpoints.requestParamLimit + props.limit;
  if (props.lemmaEnd != 0 && props.selectedDocuments.length == 1){
    requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end=" + props.lemmaEnd;
  }
  // make request to get data
  const {response, loading} = useGetData(requestUrl);

  // create unique id to select with d3 and reference with react
  // const rnd from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15456423
  const rnd = (len, chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
  const id = rnd(15);


  const x = d => d3.timeParse("%d.%m.%Y")(d.date);
  const y = d => d.count;
  const z = d => d.id;
  let defined; // for gaps in data
  const curve = d3.curveLinear // method of interpolation between points
  const marginTop = 20 // top margin, in pixels
  const marginRight = 0 // right margin, in pixels
  const marginBottom = 0 // bottom margin, in pixels
  const marginLeft = 0 // left margin, in pixels
  const width = 640 // outer width, in pixels
  const size = 25 // outer height of a single horizon, in pixels
  const bands = 5// number of bands
  const padding = 1 // separation between adjacent horizons
  const xType = d3.scaleUtc // type of x-scale
  let xDomain // [xmin, xmax]
  const xRange = [marginLeft, width - marginRight] // [left, right]
  const yType = d3.scaleLinear // type of y-scale
  let yDomaim // [ymin, ymax]
  const yRange = [size, size - bands * (size - padding)] // [bottom, top]
  let zDomain // array of z-values
  const scheme = d3.schemeBlues // color scheme; shorthand for colors
  const colors = scheme[Math.max(3, bands)] // an array of colors

  const ref = useD3(
      (svg) => {

        // display only data that is in more then one dataset
        const data = response.filter(item => response.filter(x => x.id === item.id).length > 1);

        // Compute values.
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
        const Z = d3.map(data, z);
        if (defined === undefined) {
          defined = (d, i) => !isNaN(X[i]) && !isNaN(
              Y[i]);
        }
        const D = d3.map(data, defined);

        // Compute default domains, and unique the z-domain.
        const xDomain = d3.extent(X);
        const yDomain = [0, d3.max(Y)];
        if (zDomain === undefined) {
          zDomain = Z;
        }
        zDomain = new d3.InternSet(zDomain);

        // Omit any data not present in the z-domain.
        const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

        // Compute height.
        const height = zDomain.size * size + marginTop + marginBottom;

        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        const xAxis = d3.axisTop(xScale).ticks(width / 80).tickSizeOuter(0);

        // A unique identifier for clip paths (to avoid conflicts).
        const uid = `O-${Math.random().toString(16).slice(2)}`;

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
        .attr("style", "width: 100%; height: inherit; height: intrinsic;")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

        const g = svg.append("g").selectAll("g")
        .data(d3.group(I, i => Z[i]))
        .join("g")
        .attr("transform", (_, i) => `translate(0,${i * size + marginTop})`);


        const defs = g.append("defs");

        defs.append("clipPath")
        .attr("id", (_, i) => `${uid}-clip-${i}`)
        .append("rect")
        .attr("y", padding)
        .attr("width", width)
        .attr("height", size - padding);

        defs.append("path")
        .attr("id", (_, i) => `${uid}-path-${i}`)
        .attr("d", ([, I]) => area(I));

        g
        .attr("clip-path", (_, i) => `url(${new URL(`#${uid}-clip-${i}`, document.location)})`)
        .selectAll("use")
        .data((d, i) => new Array(bands).fill(i))
        .join("use")
        .attr("fill", (_, i) => colors[i + Math.max(0, 3 - bands)])
        .attr("transform", (_, i) => `translate(0,${i * size})`)
        .attr("xlink:href", (i) => `${new URL(`#${uid}-path-${i}`, document.location)}`);

        g.append("text")
        .attr("x", marginLeft)
        .attr("y", (size + padding) / 2)
        .attr("dy", "0.35em")
        .text(([z]) => z);

        // Since there are normally no left or right margins, don’t show ticks that
        // are close to the edge of the chart, as these ticks are likely to be clipped.
        svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.selectAll(".tick")
        .filter(d => xScale(d) < 10 || xScale(d) > width - 10)
        .remove())
        .call(g => g.select(".domain").remove());

      },
      [response]
  );


  return (
        <svg id={id} ref={ref}>
        </svg>
  )
}
