import React, {useEffect, useState} from "react";
import {Box, Button, Tooltip} from "@mui/material";
import SelectField from "./SelectField";

import useGetData from "../../api_crud/useGetData";
import {apiEndpoints, visualizationsValues} from "../../helper/envConst";
import TextHighlighted from "../visualizations/text/TextHighlighted";


const optionsCategory = [
    {value: 'chart', label: 'Chart Visualisierung'},
    {value: 'text', label: 'Text Visualisierung'},
]

const optionsVisualizationSum = [
    {value: 'areachart', label: 'Area Chart'},
    {value: 'barchart', label: 'Bar Chart'},
    {value: 'bubblechart', label: 'Bubble Chart'},
    {value: 'doughnutchart', label: 'Doughnut Chart'},
    {value: 'horizontalbarchart', label: 'Horizontal Bar Chart'},
    {value: 'linechart', label: 'Line Chart'},
    {value: 'piechart', label: 'Pie Chart'},
    {value: 'polarareachart', label: 'Polar Area Chart'},
    {value: 'radarchart', label: 'Radar Chart'},
    {value: 'scatterchart', label: 'Scatter Chart'},
];
const optionsVisualizationSumByGroup = [
    {value: 'stackedbarchart', label: 'Stacked Bar Chart'},
    {value: 'stackedbarchartnormalized', label: 'Stacked Bar Chart Normalized'},
    {value: 'stackedhorizontalbarchart', label: 'Stacked Horizontal Bar Chart'},
];
const optionsVisualizationSumByTime = [
    {value: 'horizonchart', label: 'Horizon Chart'},
    {value: 'stackedareachart', label: 'Stacked Area Chart'},
];
const optionsVisualizationText = [
    {value: 'textcomponent', label: 'Text'},
    {value: 'richtexteditor', label: 'Rich Text Editor'},
    {value: 'wordcloud', label: 'Word Cloud'},
];
const optionsVisualizationsTextHighlight = [
    {value: 'highlightedtextcomponent', label: 'Highlighted Text'},
];

const optionsVisualizationMaps = [
    {value: 'worldmapcities', label: 'World Map With Cities'},
    {value: 'worldmapcountries', label: 'World Map With Countries'},
    {value: 'worldmapareas', label: 'World Map With Areas'},
];

/**
 * container for number of select inputs.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectContainer(props) {

    const {response, loading} = useGetData(
        apiEndpoints.basis + apiEndpoints.general);

    // darin wird userauswahl gespeichert
    const [selectedTypes, setSelectedTypes] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedVisualization, setSelectedVisualization] = useState("");


    // lade optionen für daten die vom server bereitgestellt werden
    let optionsType = [];
    const [optionsAttribute, setOptionsAttribute] = useState([]);

    // packe daten von response in options*
    useEffect(async () => {
        if (!loading && optionsType.length === 0) {

            response["types"].forEach((type) => {
                optionsType.push({value: type, label: type.replaceAll("_", " ").toUpperCase()})
                optionsType.sort()
            })

            setOptionsAttribute(response["attributes"]);
        }
    }, [response, optionsType, loading])

    function addVisualization() {
        const isText = selectedVisualization === "highlightedtextcomponent" || selectedVisualization === "textcomponent" || selectedVisualization === "richtexteditor";
        if (enableButton()) {
            props.addVisualization(selectedTypes, selectedAttributes, selectedVisualization, isText)
        }
    }

    function enableButton() {
        return selectedTypes.length !== 0 && selectedAttributes.length !== 0 && selectedVisualization !== "";
    }

    function getMatchingAttributes() {
        let optionsAttributeFiltered = [];
        let optionsMatchingAttributes = [];

        for (const [key, value] of Object.entries(optionsAttribute)) {
            if (selectedTypes.includes(key)) {
                optionsAttributeFiltered = optionsAttributeFiltered.concat(value)
            }
        }


        optionsAttributeFiltered.push("date")
        optionsAttributeFiltered.push("name")
        optionsAttributeFiltered = [...new Set(optionsAttributeFiltered)].sort();
        optionsAttributeFiltered.forEach((value) => {
            optionsMatchingAttributes.push({value: value, label: value})
        })

        return optionsMatchingAttributes.sort();
    }

    function getMatchingVisualizations() {
        if (selectedAttributes.length === 1) {
            // Dann sollte World Map dabei sein.
            if (selectedTypes.includes("de_tudarmstadt_ukp_dkpro_core_api_ner_type_NamedEntity") && selectedAttributes.includes("tokenValue")) {
                return optionsVisualizationSum.concat(optionsVisualizationText).concat(optionsVisualizationMaps);
            }
            return optionsVisualizationSum.concat(optionsVisualizationText);
        } else if (selectedAttributes.length === 2 && selectedAttributes.includes("begin") && selectedAttributes.includes("end")) {
            return optionsVisualizationSum;
        } else if (selectedAttributes.length === 2 && selectedAttributes.includes("date") || selectedAttributes.length === 3 && selectedAttributes.includes("begin") && selectedAttributes.includes("end") && selectedAttributes.includes("date")) {
            return optionsVisualizationSumByTime;
        } else if (selectedAttributes.length === 2 && !selectedAttributes.includes("begin") && !selectedAttributes.includes("end") || selectedAttributes.length === 3 && selectedAttributes.includes("begin") && selectedAttributes.includes("end")) {
            return optionsVisualizationSumByGroup;
        } else if (selectedAttributes.length === 3 && selectedAttributes.includes("begin") && selectedAttributes.includes("end") && selectedAttributes.includes("tokenValue")) {
            return optionsVisualizationsTextHighlight;
        }
    }

    return (
        <Box display="flex" sx={{m: 2}}>
            <SelectField
                key="types"
                options={optionsType}
                selectedOption={selectedTypes}
                setSelectedOption={setSelectedTypes}
                isMulti={true}
            />
            {
                selectedTypes != "" &&
                <SelectField
                    key="attributes"
                    options={getMatchingAttributes()}
                    selectedOption={selectedAttributes}
                    setSelectedOption={setSelectedAttributes}
                    isMulti={true}
                />
            }
            {
                selectedAttributes != "" && selectedTypes != "" &&
                <SelectField
                    key="visualizations"
                    options={getMatchingVisualizations()}
                    selectedOption={selectedVisualization}
                    setSelectedOption={setSelectedVisualization}
                    isMulti={false}
                />
            }
            <Tooltip title={'Create new Visualization'}>
                <Button color="inherit" onClick={addVisualization} disabled={!enableButton()}>+CREATE</Button>
            </Tooltip>
        </Box>
    )
}

export default SelectContainer;
