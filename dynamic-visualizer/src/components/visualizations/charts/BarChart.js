import React from "react";
import {Bar} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../../../helper/useGetChartData";

function BarChart(props) {


    const dataForVisualization = useGetChartData(props.label, props.url, props.limit);

    return (
        <Bar data={dataForVisualization}/>
    )

}

export default BarChart;