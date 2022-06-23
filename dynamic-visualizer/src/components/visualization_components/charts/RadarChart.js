import React from "react";
import {Radar} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../scripts/useGetChartData";

function RadarChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url);

    return (
        <Radar data={dataForVisualization}/>
    )
}

export default RadarChart;