import React from "react";
import {Doughnut} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function DoughnutChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Doughnut data={dataForVisualization}/>
    )

}

export default DoughnutChart;