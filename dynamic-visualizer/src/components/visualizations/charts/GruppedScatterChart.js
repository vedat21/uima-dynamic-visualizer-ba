import * as d3 from "d3";

import useD3 from "./helper/useD3";
import {getRequestUrl, uniqueId} from "../../../helper/generalHelper";
import useGetData from "../../../api_crud/useGetData";

export default function GruppedScatterChart(props) {

    // Data
    const {response, loading} = useGetData(getRequestUrl(props));
    const data = response;
    const id = uniqueId();

    const height = 400;
    const width = 1000;
    const margin = ({top: 25, right: 20, bottom: 35, left: 40});
    const shape = d3.scaleOrdinal(data.map(d => d.sentimentCategory), d3.symbols.map(s => d3.symbol().type(s)()))
    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(props.selectedYLabel));
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.begin)).nice()
        .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.end)).nice()
        .range([height - margin.bottom, margin.top]);
    const color = d3.scaleOrdinal(data.map(d => d.sentimentCategory), d3.schemeCategory10);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(props.selectedXLabel));
    const grid = g => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g.append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
            .attr("x1", d => 0.5 + x(d))
            .attr("x2", d => 0.5 + x(d))
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom))
        .call(g => g.append("g")
            .selectAll("line")
            .data(y.ticks())
            .join("line")
            .attr("y1", d => 0.5 + y(d))
            .attr("y2", d => 0.5 + y(d))
            .attr("x1", margin.left)
            .attr("x2", width - margin.right));

    const ref = useD3(
        (svg) => {
            svg = d3.select("#"+id)
                .attr("viewBox", [0, 0, width, height]);

            svg.append("g")
                .call(xAxis);

            svg.append("g")
                .call(yAxis);

            svg.append("g")
                .call(grid);

            svg.append("g")
                .attr("stroke-width", 1.5)
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .selectAll("path")
                .data(data)
                .join("path")
                .attr("transform", d => `translate(${x(d.begin)},${y(d.end)})`)
                .attr("fill", d => color(d.sentimentCategory))
                .attr("d", d => shape(d.sentimentCategory));

            return svg.node();

        },
        [response]
    );

    return (
        <svg id={id} ref={ref}/>
    )

}
