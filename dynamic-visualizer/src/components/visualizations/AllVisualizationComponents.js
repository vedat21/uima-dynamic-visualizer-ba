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
import RichTextEditor from "./other/RichTextEditor";
import TextComponent from "./other/TextComponent";
import ChartTopBar from "./topbars/ChartTopBar";
import OtherVisualizationsTopBar from "./topbars/OtherVisualizationsTopBar";


// all visualization components. map string to the component. Has to match values in SelectContainer.js
const components = {
    "barchart": BarChart,
    "bubblechart": BubbleChart,
    "doughnutchart": DoughnutChart,
    "linechart": LineChart,
    "piechart": PieChart,
    "polarareachart": PolarAreaChart,
    "scatterchart": ScatterChart,
    "radarchart": RadarChart,
    "richtexteditor": RichTextEditor,
};

/**
 * return react component
 * @param visualization
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
export default (visualization, editable, onDeleteComponentClicked, limit, label, changeLimit, changeLabel, inputLabelAndLimit, handleOnClickInput, editRichtext, richTextContent, documents) => {
    // component does exist
    if (typeof components[visualization.component] !== "undefined") {


        // entweder erstell komponenten die texttopbar oder charttopbar entählt. rest identisch
        // hier texttopbar
        if (visualization.component.includes("text")) {
            return React.createElement("div", {key: uuid()}, [
                React.createElement(OtherVisualizationsTopBar, {
                    key: uuid(),
                    editable: editable,
                    onDeleteComponentClicked: onDeleteComponentClicked,
                }),
                React.createElement(components[visualization.component], {
                    key: uuid(),
                    label: label,
                    editable: editable,
                    content: richTextContent,
                    editRichtext: editRichtext
                }),

            ]);
        }
        else {
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
                React.createElement(components[visualization.component], {
                    key: uuid(),
                    label: label,
                    url: visualization.url,
                    limit: limit,
                    documents: documents
                }),

            ]);
        }

    }
}