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
import RichTextEditor from "./text/RichTextEditor";
import ChartTopBar from "./topbars/ChartTopBar";
import TextTopBar from "./topbars/TextTopBar";
import DocumentText from "./text/DocumentText";

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
  "textcomponent": DocumentText
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
export default (visualization, editable, onDeleteComponentClicked, limit, label,
    changeLimit, changeLabel, inputLabelAndLimit, handleOnClickInput,
    editRichtext, richTextContent, selectedDocuments) => {

  console.log(visualization)
  if (typeof components[visualization.component] !== "undefined") {
    // entweder erstell komponenten die texttopbar oder charttopbar entählt.
    // hier texttopbar
    if (visualization.component.includes("text")) {
      console.log("asdadasd");
      return React.createElement("div", {key: uuid()}, [
        React.createElement(TextTopBar, {
          key: uuid(),
          editable: editable,
          onDeleteComponentClicked: onDeleteComponentClicked,
        }),
        React.createElement(components[visualization.component], {
          key: uuid(),
          label: label,
          editable: editable,
          content: richTextContent,
          editRichtext: editRichtext,
          selectedDocuments: selectedDocuments
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
        React.createElement(components[visualization.component], {
          key: uuid(),
          label: label,
          url: visualization.url,
          limit: limit,
          selectedDocuments: selectedDocuments
        }),

      ]);
    }

  }
}