import React from "react";
import {PolarArea} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function PolarAreaChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <PolarArea data={dataForVisualization}/>
    )

}

export default PolarAreaChart;