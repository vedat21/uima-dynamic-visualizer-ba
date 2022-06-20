import React from "react";
import {Scatter} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function ScatterChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Scatter data={dataForVisualization}/>
    )

}

export default ScatterChart;