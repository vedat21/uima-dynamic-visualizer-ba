import React from "react";
import {Line} from "react-chartjs-2"
import Chart from 'chart.js/auto';
import useGetChartData from "../scripts/useGetChartData"; // ohne diesen import werden die charts nicht geladen

// Custom Modules

function LineChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url);


    return (
        <Line data={dataForVisualization}/>
    )
}

export default LineChart;