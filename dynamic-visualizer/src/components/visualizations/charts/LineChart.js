import React from "react";
import {Line} from "react-chartjs-2"
import Chart from 'chart.js/auto';
import useGetChartData from "../../../api_crud/useGetChartData"; // ohne diesen import werden die charts nicht geladen

// Custom Modules

function LineChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url, props.limit, props.selectedDocuments, props.lemmaBegin, props.lemmaEnd);

    return (
        <Line data={dataForVisualization}/>
    )
}

export default LineChart;