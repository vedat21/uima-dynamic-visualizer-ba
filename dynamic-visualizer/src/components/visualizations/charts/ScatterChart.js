import React from "react";
import {Scatter} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../../../helper/useGetChartData";

function ScatterChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url);


    return (
        <Scatter data={dataForVisualization}/>
    )
}

export default ScatterChart;