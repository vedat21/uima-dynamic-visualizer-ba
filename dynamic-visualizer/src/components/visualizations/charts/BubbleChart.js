import React from "react";
import {Bubble} from "react-chartjs-2"
import Chart from 'chart.js/auto';
import useGetChartData from "../../../helper/useGetChartData"; // ohne diesen import werden die charts nicht geladen

// custom modules

function BubbleChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url, props.limit, props.selectedDocuments, props.lemmaBegin, props.lemmaEnd);

    return (
        <Bubble data={dataForVisualization}/>
    )
}

export default BubbleChart;