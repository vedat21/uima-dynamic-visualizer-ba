import React from "react";
import BarChart from "./charts/BarChart"
import BubbleChart from "./charts/BubbleChart";
import DoughnutChart from "./charts/DoughnutChart"
import LineChart from "./charts/LineChart"
import PieChart from "./charts/PieChart";
import PolarAreaChart from "./charts/PolarAreaChart";
import RadarChart from "./charts/RadarChart"
import ScatterChart from "./charts/ScatterChart";
import TextComponent from "./other/TextComponent";
import TextArea from "./other/TextArea";
import ChartTopBar from "./general/ChartTopBar";

import {v4 as uuid} from 'uuid';
import TextTopBar from "./general/TextTopBar";
import TestChart from "../../helper/TestChart";


// all visualization components. map string to the component.
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
    "testchart": TestChart,
};



/**
 * return react component
 * @param block is a component
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