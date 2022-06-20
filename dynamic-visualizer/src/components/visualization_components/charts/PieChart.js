import React from "react";
import {Pie} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function PieChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Pie data={dataForVisualization}/>
    )

}

export default PieChart;