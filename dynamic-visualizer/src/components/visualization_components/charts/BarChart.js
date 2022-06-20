import React from "react";
import {Bar} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function BarChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Bar data={dataForVisualization}/>
    )

}

export default BarChart;