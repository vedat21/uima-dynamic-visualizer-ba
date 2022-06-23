import React from "react";
import {Bubble} from "react-chartjs-2"
import Chart from 'chart.js/auto';
import useGetChartData from "../scripts/useGetChartData"; // ohne diesen import werden die charts nicht geladen

// custom modules

function BubbleChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url);


    return (
        <Bubble data={dataForVisualization}/>
    )
}

export default BubbleChart;