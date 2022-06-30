import React from "react";
import BarChart from "./visualization_components/charts/BarChart"
import BubbleChart from "./visualization_components/charts/BubbleChart";
import DoughnutChart from "./visualization_components/charts/DoughnutChart"
import LineChart from "./visualization_components/charts/LineChart"
import PieChart from "./visualization_components/charts/PieChart";
import PolarAreaChart from "./visualization_components/charts/PolarAreaChart";
import RadarChart from "./visualization_components/charts/RadarChart"
import ScatterChart from "./visualization_components/charts/ScatterChart";
import TextComponent from "./visualization_components/other/TextComponent";
import TextArea from "./visualization_components/other/TextArea";
import ChartTopBar from "./visualization_components/general/ChartTopBar";

import {v4 as uuid} from 'uuid';
import TextTopBar from "./visualization_components/general/TextTopBar";


// all visualization components to map a string to the component.
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
export default (block, editable, label, url, onDeleteComponentClicked, changeLimit, editLabel, reverseEditLabel, changeLabel) => {
    // component does exist
    if (typeof components[block.component] !== "undefined") {

        // entweder erstell komponenten die texttopbar oder charttopbar entählt. rest identisch
        if (block.component.startsWith("text")) {
            return React.createElement("div", {key: uuid()}, [
                React.createElement(TextTopBar, {
                    editable: editable,
                    onDeleteComponentClicked: onDeleteComponentClicked,
                }),
                React.createElement(components[block.component], {
                    block: block,
                    editable: editable,
                    label: label,
                    targetData: block.targetData,
                    url: url,
                }),

            ]);
        }
        else {
            return React.createElement("div", {key: uuid()}, [
                React.createElement(ChartTopBar, {
                    editable: editable,
                    onDeleteComponentClicked: onDeleteComponentClicked,
                    changeLimit: changeLimit,
                    editLabel: editLabel,
                    reverseEditLabel: reverseEditLabel,
                    changeLabel: changeLabel,

                }),
                React.createElement(components[block.component], {
                    block: block,
                    editable: editable,
                    label: label,
                    targetData: block.targetData,
                    url: url,
                }),

            ]);
        }


    }
}