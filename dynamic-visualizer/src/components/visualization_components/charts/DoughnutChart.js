import React from "react";
import {Doughnut} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../scripts/useGetChartData";

function DoughnutChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url);


    return (
        <Doughnut data={dataForVisualization}/>
    )
}

export default DoughnutChart;