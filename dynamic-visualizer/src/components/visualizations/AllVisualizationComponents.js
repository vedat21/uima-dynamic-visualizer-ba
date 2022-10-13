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
import WorldMapMarkCities from "./other/WorldMapMarkCities";
import WorldMapMarkAreas from "./other/WorldMapMarkAreas";
import WorldMapMarkCountries from "./other/WorldMapMarkCountries";
import AreaChart from "./charts/AreaChart";
import WordCloudComponent from "./text/WordCloudComponent";

// all visualization components. map string to the component. Has to match values in SelectContainer.js
const components = {
  "areachart": AreaChart,
  "barchart": BarChart,
  "bubblechart": BubbleChart,
  "doughnutchart": DoughnutChart,
  "linechart": LineChart,
  "piechart": PieChart,
  "polarareachart": PolarAreaChart,
  "scatterchart": ScatterChart,
  "radarchart": RadarChart,
  "richtexteditor": RichTextEditor,
  "textcomponent": DocumentText,
  "worldmapcities": WorldMapMarkCities,
  "worldmapareas": WorldMapMarkAreas,
  "worldmapcountries": WorldMapMarkCountries,
  "wordcloud" : WordCloudComponent,
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
    editRichtext, richTextContent, selectedDocuments, lemmaBegin, setLemmaBegin, lemmaEnd, setLemmaEnd) => {

  if (typeof components[visualization.component] !== "undefined") {
    // entweder erstell komponenten die texttopbar oder charttopbar entählt.
    // hier texttopbar
    if (visualization.component.includes("text")) {
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
          selectedDocuments: selectedDocuments,
          lemmaBegin: lemmaBegin,
          setLemmaBegin: setLemmaBegin,
          setLemmaEnd: setLemmaEnd,
          lemmaEnd: lemmaEnd
        }),

      ]);
    } else {
      console.log(visualization)
      return React.createElement("div", {key: uuid(), style: {height: "100%"}}, [
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
          selectedDocuments: selectedDocuments,
          lemmaBegin: lemmaBegin,
          lemmaEnd: lemmaEnd,
          editable: editable
        }),

      ]);
    }

  }
}