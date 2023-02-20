import React from "react";
import {v4 as uuid} from 'uuid';

// custom modules
import BubbleChart from "./charts/BubbleChart";
import LineChart from "./charts/sum/LineChart"
import PolarAreaChart from "./charts/sum/PolarAreaChart";
import RadarChart from "./charts/sum/RadarChart"
import ScatterChart from "./charts/ScatterChart";
import RichTextEditor from "./text/RichTextEditor";
import ChartTopBar from "./topbars/ChartTopBar";
import TextTopBar from "./topbars/TextTopBar";
import TextComponent from "./text/TextComponent";
import WorldMapMarkCities from "./other/WorldMapMarkCities";
import WorldMapMarkAreas from "./other/WorldMapMarkAreas";
import WorldMapMarkCountries from "./other/WorldMapMarkCountries";
import AreaChart from "./charts/sum/AreaChart";
import WordCloudComponent from "./text/WordCloudComponent";
import HorizonAreaChart from "./charts/sumbygroup/HorizonAreaChart";
import StackedAreaChart from "./charts/sumbygroup/StackedAreaChart";
import TextHighlighted from "./text/TextHighlighted";
import PieChart from "./charts/sum/PieChart";
import DoughnutChart from "./charts/sum/DoughnutChart";
import BarChart from "./charts/sum/BarChart";
import StackedBarChart from "./charts/sumbygroup/StackedBarChart";
import HorizontalBarChart from "./charts/sum/HorizontalBarChart";
import StackedHorizontalBarChart from "./charts/sumbygroup/StackedHorizontalBarChart";
import StackedBarChartNormalized from "./charts/sumbygroup/StackedBarChartNormalized";


// all visualization components. map string to the component. Has to match values in SelectContainer.js
const components = {
    "areachart": AreaChart,
    "barchart": BarChart,
    "bubblechart": BubbleChart,
    "doughnutchart": DoughnutChart,
    "highlightedtextcomponent": TextHighlighted,
    "horizonchart": HorizonAreaChart,
    "horizontalbarchart": HorizontalBarChart,
    "linechart": LineChart,
    "piechart": PieChart,
    "polarareachart": PolarAreaChart,
    "radarchart": RadarChart,
    "richtexteditor": RichTextEditor,
    "scatterchart": ScatterChart,
    "stackedareachart": StackedAreaChart,
    "stackedbarchart": StackedBarChart,
    "stackedbarchartnormalized": StackedBarChartNormalized,
    "stackedhorizontalbarchart": StackedHorizontalBarChart,
    "textcomponent": TextComponent,
    "wordcloud": WordCloudComponent,
    "worldmapareas": WorldMapMarkAreas,
    "worldmapcities": WorldMapMarkCities,
    "worldmapcountries": WorldMapMarkCountries,
};

/**
 * To return react component
 * @param visualization
 * @param editable
 * @param onDeleteComponentClicked
 * @param label
 * @param editRichtext
 * @param richTextContent
 * @param selectedDocuments
 * @param lemmaBegin
 * @param setLemmaBegin
 * @param lemmaEnd
 * @param setLemmaEnd
 * @param editVisualization
 * @returns {React.ReactElement<{key}>|React.DetailedReactHTMLElement<{style: {height: string}, key}, HTMLElement>}
 */
export default (visualization, editable, onDeleteComponentClicked, label,
                editRichtext, richTextContent, selectedDocuments, lemmaBegin, setLemmaBegin, lemmaEnd, setLemmaEnd, editVisualization) => {

    if (typeof components[visualization.selectedVisualization] !== "undefined") {
        // entweder erstell komponenten die texttopbar oder charttopbar entählt.
        // hier texttopbar
        if (visualization.selectedVisualization.includes("text")) {
            return React.createElement("div", {key: uuid()}, [
                React.createElement(TextTopBar, {
                    editable: editable,
                    key: uuid(),
                    onDeleteComponentClicked: onDeleteComponentClicked,
                }),
                React.createElement(components[visualization.selectedVisualization], {
                    content: richTextContent,
                    editable: editable,
                    editRichtext: editRichtext,
                    key: uuid(),
                    label: label,
                    lemmaBegin: lemmaBegin,
                    lemmaEnd: lemmaEnd,
                    selectedDocuments: selectedDocuments,
                    setLemmaBegin: setLemmaBegin,
                    setLemmaEnd: setLemmaEnd,
                    url: visualization.url,
                }),

            ]);
        } else {
            // height muss 100% sein wegen world map
            return React.createElement("div", {key: uuid(), style: {height: "100%"}}, [
                React.createElement(ChartTopBar, {
                    editable: editable,
                    editVisualization: editVisualization,
                    id: visualization.id,
                    key: uuid(),
                    onDeleteComponentClicked: onDeleteComponentClicked,
                    selectedAttributes: visualization.selectedAttributes,
                    selectedConditions: visualization.selectedConditions,
                    selectedLabel: label,
                    selectedMaxOccurrence: visualization.selectedMaxOccurrence,
                    selectedMinOccurrence: visualization.selectedMinOccurrence,
                    selectedTypes: visualization.selectedTypes,
                    selectedVisualization: visualization.selectedVisualization,
                }),
                React.createElement(components[visualization.selectedVisualization], {
                    editable: editable,
                    key: uuid(),
                    label: label,
                    lemmaBegin: lemmaBegin,
                    lemmaEnd: lemmaEnd,
                    limit: visualization.limit,
                    selectedDocuments: selectedDocuments,
                    selectedMaxOccurrence: visualization.selectedMaxOccurrence,
                    selectedMinOccurrence: visualization.selectedMinOccurrence,
                    types: visualization.types,
                    url: visualization.url,
                }),

            ]);
        }

    }
}
