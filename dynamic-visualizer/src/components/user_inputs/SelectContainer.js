import React, {useEffect, useState} from "react";
import {Box, Button, Tooltip} from "@mui/material";
import SelectField from "./SelectField";

import useGetData from "../../api_crud/useGetData";
import {apiEndpoints} from "../../helper/envConst";

// Alle möglichen Visualisierungskomponenten
const optionsVisualization = [
    {value: 'areachart', label: 'Area Chart'},
    {value: 'barchart', label: 'Bar Chart'},
    {value: 'bubblechart', label: 'Bubble Chart'},
    {value: 'doughnutchart', label: 'Doughnut Chart'},
    {value: 'horizonchart', label: 'Horizon Chart'},
    {value: 'linechart', label: 'Line Chart'},
    {value: 'piechart', label: 'Pie Chart'},
    {value: 'polarareachart', label: 'Polar Area Chart'},
    {value: 'scatterchart', label: 'Scatter Chart'},
    {value: 'radarchart', label: 'Radar Chart'},
    {value: 'textcomponent', label: 'Text'},
    {value: 'richtexteditor', label: 'Rich Text Editor'},
    {value: 'stackedareachart', label: 'Stacked Area Chart'},
    {value: 'worldmapcities', label: 'World Map With Cities'},
    {value: 'worldmapcountries', label: 'World Map With Countries'},
    {value: 'worldmapareas', label: 'World Map With Areas'},
    {value: 'wordcloud', label: 'Word Cloud'},

];

const optionsCategory = [
    {value: 'summe', label: 'Summierte Visualisierung'},
    {value: 'text', label: 'Text Visualisierung'},
    {value: 'world', label: 'World Map Visualisierung'},
    {value: 'zeit', label: 'Zeit Visualisierung'},
]

/**
 * container for number of input select.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectContainer(props) {

    const {response, loading} = useGetData(
        apiEndpoints.basis + apiEndpoints.general);

    // darin wird userauswahl gespeichert
    const [selectedTypes, setSelectedTypes] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedVisualization, setSelectedVisualization] = useState("");


    // lade optionen für daten die vom server bereitgestellt werden
    let optionsType = [];
    const [optionsAttribute, setOptionsAttribute] = useState([]);
    let optionsRelation = [];

    // packe daten von response in options*
    useEffect(async () => {
        if (!loading && optionsType.length == 0) {

            response["types"].forEach((type) => {
                /*
                let label = type.split("_type_")[1]
                // um schönere Label bei POS anzeigen
                if (label.startsWith("pos_")) {
                    label = label.substring(4);
                }
                 */

                optionsType.push({value: type, label: type.toUpperCase()})
                optionsType.sort()
            })

            setOptionsAttribute(response["attributes"]);
        }
    }, [response, optionsType, loading])

    function addVisualization() {
        if (enableButton()) {
            props.addVisualization(selectedTypes, selectedAttributes, selectedCategory, selectedVisualization)
        }
    }

    function enableButton() {
        return selectedTypes.length !== 0 && selectedAttributes.length !== 0 && selectedCategory !== "" && selectedVisualization !== "";
    }

    function getMatchingAttributes() {
        let optionsAttributeFiltered = [];
        let optionsAttributeFilteredResult = [];

        for (const [key, value] of Object.entries(optionsAttribute)) {
            if (selectedTypes.includes(key)) {
                optionsAttributeFiltered = optionsAttributeFiltered.concat(value)
            }
        }

        optionsAttributeFiltered = [...new Set(optionsAttributeFiltered)].sort();
        optionsAttributeFiltered.forEach((value) => {
            optionsAttributeFilteredResult.push({value: value, label: value})
        })

        return optionsAttributeFilteredResult
    }

    return (
        <Box display="flex" sx={{m: 2}}>
            <SelectField
                key={"types"}
                options={optionsType}
                selectedOption={selectedTypes}
                setSelectedOption={setSelectedTypes}
                isMulti={true}
            />
            {
                selectedTypes != "" &&
                <SelectField
                    key={"attributes"}
                    options={getMatchingAttributes()}
                    selectedOption={selectedAttributes}
                    setSelectedOption={setSelectedAttributes}
                    isMulti={true}
                />
            }
            {
                selectedAttributes != "" && selectedTypes != "" &&
                <SelectField
                    key={"category"}
                    options={optionsCategory}
                    selectedOption={selectedCategory}
                    setSelectedOption={setSelectedCategory}
                    isMulti={false}
                />
            }
            {
                selectedAttributes != "" && selectedTypes != "" && selectedCategory != "" &&
                <SelectField
                    key={"visualizations"}
                    options={optionsVisualization}
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
