import React from "react";
import {Radar} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function RadarChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Radar data={dataForVisualization}/>
    )

}

export default RadarChart;