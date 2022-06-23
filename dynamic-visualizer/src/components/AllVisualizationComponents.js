import React from "react";
import BarChart from "./visualization_components/charts/BarChart"
import BubbleChart from "./visualization_components/charts/BubbleChart";
import DoughnutChart from "./visualization_components/charts/DoughnutChart"
import LineChart from "./visualization_components/charts/LineChart"
import PieChart from "./visualization_components/charts/PieChart";
import PolarAreaChart from "./visualization_components/charts/PolarAreaChart";
import RadarChart from "./visualization_components/charts/RadarChart"
import ScatterChart from "./visualization_components/charts/ScatterChart";
import TextComponent from "./visualization_components/TextComponent";
import TextArea from "./visualization_components/TextArea";


// all visualization components saved to map a string to the component.
const components = {
    "barchart": BarChart,
    "bubblechart": BubbleChart,
    "doughnutchart": DoughnutChart,
    "linechart": LineChart,
    "piechart": PieChart,
    "polarareachart": PolarAreaChart,
    "scatterchart": ScatterChart,
    "radarchart": RadarChart,
    "textarea": TextArea,
    "textcomponent": TextComponent,
};

/**
 * return react component
 * @param block is a component from visualization_components
 * @param editable is prop from root
 * @param label of visualization
 * @param url
 * @returns {React.FunctionComponentElement<{editable, block, label}>}
 */
export default (block, editable, label, url) => {
    // component does exist
    if (typeof components[block.component] !== "undefined") {
        return React.createElement(components[block.component], {
            block: block,
            editable: editable,
            label: label,
            targetData: block.targetData,
            url: url,
        });
    }
}