import React from "react";
import {PolarArea} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../helper/useGetChartData";

function PolarAreaChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url, props.selectedMinOccurrence, props.selectedDocuments, props.lemmaBegin, props.lemmaEnd, false);

    return (
        <PolarArea data={dataForVisualization}/>
    )
}

export default PolarAreaChart;
