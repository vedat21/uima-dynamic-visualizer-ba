import React from "react";
import {v4 as uuid} from 'uuid';

// custom modules
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
import OtherVisualizationsTopBar from "./general/OtherVisualizationsTopBar";
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
 * @param block
 * @param editable
 * @param onDeleteComponentClicked
 * @param limit
 * @param label
 * @param changeLimit
 * @param changeLabel
 * @param inputLabelAndLimit
 * @param handleOnClickInput
 * @returns {React.ReactElement<{key}>}
 */
export default (block, editable, onDeleteComponentClicked, limit, label, changeLimit, changeLabel, inputLabelAndLimit, handleOnClickInput) => {
    // component does exist
    if (typeof components[block.component] !== "undefined") {


        // entweder erstell komponenten die texttopbar oder charttopbar entählt. rest identisch
        // hier texttopbar
        if (block.component.startsWith("text")) {
            return React.createElement("div", {key: uuid()}, [
                React.createElement(OtherVisualizationsTopBar, {
                    key: uuid(),
                    editable: editable,
                    onDeleteComponentClicked: onDeleteComponentClicked,
                }),
                React.createElement(components[block.component], {
                    key: uuid(),
                    label: label,
                    url: block.url,
                }),

            ]);
        } else {
            return React.createElement("div", {key: uuid()}, [
                React.createElement(ChartTopBar, {
                    key: uuid(),
                    editable: editable,
                    onDeleteComponentClicked: onDeleteComponentClicked,
                    changeLimit: changeLimit,
                    editLabel: inputLabelAndLimit,
                    label: label,
                    limit: limit,
                    reverseEditLabel: handleOnClickInput,
                    changeLabel: changeLabel,
                }),
                React.createElement(components[block.component], {
                    key: uuid(),
                    label: label,
                    url: block.url,
                    limit: limit,
                }),

            ]);
        }

    }
}