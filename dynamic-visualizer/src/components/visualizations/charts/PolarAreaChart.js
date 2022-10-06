import React from "react";
import {PolarArea} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../../../api_crud/useGetChartData";

function PolarAreaChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url, props.limit, props.selectedDocuments, props.lemmaBegin, props.lemmaEnd);

    return (
        <PolarArea data={dataForVisualization}/>
    )
}

export default PolarAreaChart;