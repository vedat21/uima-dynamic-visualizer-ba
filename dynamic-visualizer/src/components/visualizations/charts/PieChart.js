import React from "react";
import {Pie} from "react-chartjs-2"
import Chart from 'chart.js/auto'; // ohne diesen import werden die charts nicht geladen

// Custom Modules
import useGetChartData from "../../../helper/useGetChartData";

function PieChart(props) {

    const dataForVisualization = useGetChartData(props.label, props.url, props.limit, props.selectedDocuments);

    return (
        <Pie data={dataForVisualization}/>
    )
}

export default PieChart;