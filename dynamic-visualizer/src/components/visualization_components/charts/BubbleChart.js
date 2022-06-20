import React from "react";
import {Bubble} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import getBasisData from "../scripts/getBasisData";

function BubbleChart(props) {

    const dataForVisualization = getBasisData();

    return (
        <Bubble data={dataForVisualization}/>
    )

}

export default BubbleChart;