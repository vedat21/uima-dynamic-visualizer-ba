import React from "react";
import {Line} from "react-chartjs-2"
import useGetChartData from "./helper/useGetChartData"; // ohne diesen import werden die charts nicht geladen

// Custom Modules

function AreaChart(props) {

  const dataForVisualization = useGetChartData(props.label, props.url, props.limit, props.selectedDocuments, props.lemmaBegin, props.lemmaEnd, true);

  return (
      <Line data={dataForVisualization}/>
  )
}

export default AreaChart;