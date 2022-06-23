import React, {useState} from "react";
import {Bar} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../scripts/useGetChartData";

function BarChart(props) {


    const dataForVisualization = useGetChartData(props.label, props.url);

    return (
        <>
            <Bar data={dataForVisualization}/>
        </>
    )

}

export default BarChart;