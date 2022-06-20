import React from "react";
import {Line} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function LineChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Line data={dataForVisualization}/>
    )

}

export default LineChart;