import React from "react";
import {Doughnut} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../../../helper/useGetChartData";

function DoughnutChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url, props.limit, props.selectedDocuments, props.lemmaBegin, props.lemmaEnd);

    return (
        <Doughnut data={dataForVisualization}/>
    )
}

export default DoughnutChart;