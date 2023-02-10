import React from "react";
import {v4 as uuid} from 'uuid';

// custom modules
import BarChartOld from "./notused/BarChartOld"
import BubbleChart from "./charts/BubbleChart";
import DoughnutChartOld from "./notused/DoughnutChartOld"
import LineChart from "./charts/LineChart"
import PieChartOld from "./notused/PieChartOld";
import PolarAreaChart from "./charts/PolarAreaChart";
import RadarChart from "./charts/RadarChart"
import ScatterChart from "./charts/ScatterChart";
import RichTextEditor from "./text/RichTextEditor";
import ChartTopBar from "./topbars/ChartTopBar";
import TextTopBar from "./topbars/TextTopBar";
import TextComponent from "./text/TextComponent";
import WorldMapMarkCities from "./other/WorldMapMarkCities";
import WorldMapMarkAreas from "./other/WorldMapMarkAreas";
import WorldMapMarkCountries from "./other/WorldMapMarkCountries";
import AreaChart from "./charts/AreaChart";
import WordCloudComponent from "./text/WordCloudComponent";
import HorizonAreaChart from "./charts/HorizonAreaChart";
import StackedAreaChart from "./charts/StackedAreaChart";
import TextHighlighted from "./text/TextHighlighted";
import PieChart from "./charts/PieChart";
import DoughnutChart from "./charts/DoughnutChart";
import BarChart from "./charts/BarChart";
import StackedBarChart from "./charts/StackedBarChart";
import HorizontalBarChart from "./charts/HorizontalBarChart";
import StackedHorizontalBarChart from "./charts/StackedHorizontalBarChart";


// all visualization components. map string to the component. Has to match values in SelectContainer.js
const components = {
    "areachart": AreaChart,
    "barchart": BarChart,
    "bubblechart": BubbleChart,
    "doughnutchart": DoughnutChart,
    "highlightedtextcomponent": TextHighlighted,
    "horizonchart": HorizonAreaChart,
    "horizontalbarchart" : HorizontalBarChart,
    "linechart": LineChart,
    "piechart": PieChart,
    "polarareachart": PolarAreaChart,
    "radarchart": RadarChart,
    "richtexteditor": RichTextEditor,
    "scatterchart": ScatterChart,
    "stackedareachart": StackedAreaChart,
    "stackedbarchart": StackedBarChart,
    "stackedhorizontalbarchart": StackedHorizontalBarChart,
    "textcomponent": TextComponent,
    "wordcloud": WordCloudComponent,
    "worldmapareas": WorldMapMarkAreas,
    "worldmapcities": WorldMapMarkCities,
    "worldmapcountries": WorldMapMarkCountries,
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
                    lemmaEnd: lemmaEnd,
                    url: visualization.url,
                }),

            ]);
        } else {
            // height muss 100% sein wegen world map
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
                    editable: editable,
                }),

            ]);
        }

    }
}
