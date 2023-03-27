import React, {useEffect, useState} from "react";
import {Box, Button, Stack, Switch, TextField, Tooltip} from "@mui/material";
import SelectField from "./SelectField";
import * as d3 from "d3";

import useGetData from "../../api_crud/useGetData";
import {apiEndpoints, hexToWord} from "../../helper/envConst";
import Typography from "@mui/material/Typography";

const optionsPie = ["piechart", "doughnutchart"]

// {value: 'areachart', label: 'Area Chart'}, {value: 'bubblechart', label: 'Bubble Chart'},{value: 'scatterchart', label: 'Scatter Chart'},
const optionsVisualizationSum = [
    {value: 'barchart', label: 'Bar Chart'}, {value: 'gruppedscatterchart', label: 'Grupped Scatter Chart'},
    {value: 'doughnutchart', label: 'Doughnut Chart'}, {value: 'horizontalbarchart', label: 'Horizontal Bar Chart'}, {value: 'linechart', label: 'Line Chart'},
    {value: 'piechart', label: 'Pie Chart'}, {value: 'polarareachart', label: 'Polar Area Chart'},
    {value: 'radarchart', label: 'Radar Chart'}, {value: 'wordcloud', label: 'Word Cloud'},
];
const optionsVisualizationSumByGroup = [
    {value: 'stackedbarchart', label: 'Stacked Bar Chart'},
    {value: 'stackedbarchartnormalized', label: 'Stacked Bar Chart Normalized'},
    {value: 'stackedhorizontalbarchart', label: 'Stacked Horizontal Bar Chart'},
];
const optionsVisualizationSumByTime = [{value: 'horizonchart', label: 'Horizon Chart'}, {value: 'stackedareachart', label: 'Stacked Area Chart'},];
const optionsVisualizationMaps = [{value: 'worldmapcities', label: 'World Map With Cities'}, {value: 'worldmapcountries', label: 'World Map With Countries'}, {
    value: 'worldmapareas', label: 'World Map With Areas'
},];

const optionsVisualizationText = [{value: 'textcomponent', label: 'Text'}, {value: 'richtexteditor', label: 'Rich Text Editor'},];
const optionsVisualizationsTextHighlight = [{value: 'highlightedtextcomponent', label: 'Highlighted Text'},];

const optionsVisualizationCharts = optionsVisualizationSum.concat(optionsVisualizationSumByTime).concat(optionsVisualizationSumByGroup).map(option => option.value);


/**
 * container for number of select inputs.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectionContainer(props) {

    const {response, loading} = useGetData(apiEndpoints.basis + apiEndpoints.general);

    // Options
    let optionsType = [];
    const [optionsAttribute, setOptionsAttribute] = useState([]);
    let optionsColorName = Object.keys(hexToWord);
    let optionsHex = Object.values(hexToWord);
    let optionsColor = [];
    for (let i = 0; i < optionsHex.length; i++) {
        optionsColor.push({"label": optionsHex[i], "value": optionsColorName[i]})
    }


    // User Selections
    const [selectedTypes, setSelectedTypes] = useState(props.selectedTypes ?? []);
    const [selectedAttributes, setSelectedAttributes] = useState(props.selectedAttributes ?? []);
    const [selectedCondition, setSelectedCondition] = useState(props.selectedConditions ?? []);
    const [selectedVisualization, setSelectedVisualization] = useState(props.selectedVisualization ?? []);
    const [selectedMinOccurrence, setSelectedMinOccurrence] = useState(props.selectedMinOccurrence ?? 0);
    const [selectedMaxOccurrence, setSelectedMaxOccurrence] = useState(props.selectedMaxOccurrence ?? "Infinity");
    const [selectedXLabel, setSelectedXLabel] = useState(props.selectedXLabel ?? "");
    const [selectedYLabel, setSelectedYLabel] = useState(props.selectedYLabel ?? "");
    const [selectedSorting, setSelectedSorting] = useState(props.selectedSorting ?? true);
    const [selectedPreserveEmptyAndNull, setSelectedPreserveEmptyAndNull] = useState(props.selectedPreserveEmptyAndNull ?? false);
    const [selectedColors, setSelectedColors] = useState(props.selectedColors ?? [])

    const [isChart, setIsChart] = useState(optionsVisualizationCharts.includes(selectedVisualization));

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

    /**
     * To edit a visualization with the selected input.
     */
    function addVisualization() {
        const isText = selectedVisualization === "highlightedtextcomponent" || selectedVisualization === "textcomponent" || selectedVisualization === "richtexteditor";
        if (isButtonEnabled()) {

            const selectedData = {
                "selectedPreserveEmptyAndNull": selectedPreserveEmptyAndNull,
                "selectedTypes": selectedTypes,
                "selectedAttributes": selectedAttributes,
                "selectedVisualization": selectedVisualization,
                "selectedCondition": selectedCondition,
                "selectedColors": selectedColors,
                "selectedMinOccurrence": selectedMinOccurrence,
                "selectedMaxOccurrence": selectedMaxOccurrence,
                "selectedXLabel": selectedXLabel,
                "selectedYLabel": selectedYLabel,
                "selectedSorting": selectedSorting,
                "isText": isText
            }
            props.addVisualization(selectedData)
            //     props.closeModal();
        }
    }

    /**
     * To edit a visualization with the selected input.
     */
    function editVisualization() {
        const isText = selectedVisualization === "highlightedtextcomponent" || selectedVisualization === "textcomponent" || selectedVisualization === "richtexteditor";
        const selectedData = {
            "id": props.visualizationId,
            "selectedPreserveEmptyAndNull": selectedPreserveEmptyAndNull,
            "selectedTypes": selectedTypes,
            "selectedAttributes": selectedAttributes,
            "selectedVisualization": selectedVisualization,
            "selectedCondition": selectedCondition,
            "selectedColors": selectedColors,
            "selectedMinOccurrence": selectedMinOccurrence,
            "selectedMaxOccurrence": selectedMaxOccurrence,
            "selectedXLabel": selectedXLabel,
            "selectedYLabel": selectedYLabel,
            "selectedSorting": selectedSorting,
            "isText": isText,
        }
        props.editVisualization(selectedData);
        props.closeModal();
    }

    /**
     * To enable/disable the create button.
     * @returns {boolean}
     */
    function isButtonEnabled() {
        return (selectedTypes.length !== 0 && selectedAttributes.length !== 0 && selectedVisualization.length !== 0) || (selectedTypes.length === 0 && selectedAttributes.length === 0 && selectedVisualization.length !== 0);
    }

    /**
     * To get matching Attributes based on previous selection.
     * @returns {*[]}
     */
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

    /**
     * To get matching Conditions based on previous selection.
     * @returns {*[]}
     */
    function getMatchingConditions() {
        const optionsConditions = []
        selectedAttributes.forEach((value) => {
            optionsConditions.push({value: value, label: value})
        })
        return optionsConditions;
    }

    /**
     * To get matching Visualizations based on previous selection.
     * @returns {*[]}
     */
    function getMatchingVisualizations() {
        if (selectedAttributes.length === 0) {
            return optionsVisualizationText;
        } else if (selectedAttributes.length === 1) {
            // Dann sollte World Map dabei sein.
            if (selectedTypes.includes("de_tudarmstadt_ukp_dkpro_core_api_ner_type_NamedEntity") && selectedAttributes.includes("tokenValue")) {
                return optionsVisualizationSum.concat(optionsVisualizationMaps);
            }
            return optionsVisualizationSum.concat(optionsVisualizationsTextHighlight);
        } else if (selectedAttributes.length === 2 && selectedAttributes.includes("begin") && selectedAttributes.includes("end")) {
            return optionsVisualizationSum.concat(optionsVisualizationsTextHighlight);
        } else if (selectedAttributes.length === 2 && selectedAttributes.includes("date") || selectedAttributes.length === 3 && selectedAttributes.includes("begin") && selectedAttributes.includes("end") && selectedAttributes.includes("date")) {
            return optionsVisualizationSumByTime;
        } else if (selectedAttributes.length === 2 && !selectedAttributes.includes("begin") && !selectedAttributes.includes("end") || selectedAttributes.length === 3 && selectedAttributes.includes("begin") && selectedAttributes.includes("end")) {
            return optionsVisualizationSumByGroup;
        } else if (selectedAttributes.length === 3 && selectedAttributes.includes("begin") && selectedAttributes.includes("end") && selectedAttributes.includes("tokenValue")) {
            return optionsVisualizationsTextHighlight;
        }
    }

    function setSelectedVisualizationHelper(selectedVisualization) {
        setSelectedVisualization(selectedVisualization);
        setIsChart(optionsVisualizationCharts.includes(selectedVisualization));
    }

    return (<>
        <Box display="flex" sx={{m: 2, zIndex: "1 !important"}}>
            <SelectField
                sx={{m: 2, zIndex: "1 !important"}}
                key="types"
                placeholder="Types"
                options={optionsType}
                selectedOption={selectedTypes}
                setSelectedOption={setSelectedTypes}
                isMulti={true}
            />
        </Box>
        <Box display="flex" sx={{m: 2}}>
            <SelectField
                key="attributes"
                placeholder="Attributes"
                options={getMatchingAttributes()}
                selectedOption={selectedAttributes}
                setSelectedOption={setSelectedAttributes}
                isMulti={true}
            />
        </Box>
        <Box display="flex" sx={{m: 2}}>
            <SelectField
                key="filters"
                placeholder="Filters"
                options={getMatchingConditions()}
                selectedOption={selectedCondition}
                setSelectedOption={setSelectedCondition}
                isMulti={true}
            />
        </Box>
        <Box display="flex" sx={{m: 2}}>
            <SelectField
                key="visualizations"
                placeholder="Visualization"
                options={getMatchingVisualizations()}
                selectedOption={selectedVisualization}
                setSelectedOption={setSelectedVisualizationHelper}
                isMulti={false}
            />
        </Box>
        {isChart && <>
            <Box display="flex" sx={{m: 2, zIndex: "-1 !important"}}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    label="Min"
                    autoComplete="off"
                    type="number"
                    min="0"
                    defaultValue={selectedMinOccurrence}
                    onChange={(event) => setSelectedMinOccurrence(event.target.value)}
                />
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    label="Max"
                    autoComplete="off"
                    type={selectedMaxOccurrence === "Infinity" ? "" : "number"}
                    min="0"
                    defaultValue={selectedMaxOccurrence === "Infinity" ? "∞" : selectedMaxOccurrence}
                    onChange={(event) => setSelectedMaxOccurrence(event.target.value)}
                />
                <Stack style={{marginLeft: 20}} direction="row" spacing={1} alignItems="center">
                    <Typography>DESC</Typography>
                    <Switch onChange={() => setSelectedSorting(!selectedSorting)} inputProps={{"aria-label": "ant design"}} defaultChecked={selectedSorting}/>
                    <Typography>ASC</Typography>
                </Stack>
            </Box>
            <Box display="flex" sx={{m: 2}}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    label="X-Label"
                    autoComplete="off"
                    defaultValue={selectedXLabel}
                    onChange={(event) => setSelectedXLabel(event.target.value)}
                />
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    label="Y-Label"
                    autoComplete="off"
                    defaultValue={selectedYLabel}
                    onChange={(event) => setSelectedYLabel(event.target.value)}
                />

                <SelectField
                    key="colors"
                    placeholder="Colors"
                    options={optionsColor}
                    selectedOption={selectedColors}
                    setSelectedOption={setSelectedColors}
                    isMulti={true}
                />
            </Box>
        </>}
        <Box key="create-and-close-buttons" display="flex" sx={{m: 3}} justifyContent="center">
            <Tooltip title={'Create new Visualization'}>
                <Button variant="outlined" onClick={props.isEdit ? editVisualization : addVisualization} disabled={!isButtonEnabled()}>{props.text}</Button>
            </Tooltip>
            <Button variant="outlined" onClick={props.closeModal}>Close Window</Button>
        </Box>
    </>)
}

export default SelectionContainer;

/*
{optionsVisualizationSumByGroup.map(option => option.value).includes(selectedVisualization) &&
                    <Stack style={{marginLeft: 20}} direction="row" spacing={1} alignItems="center">
                        <Switch onChange={() => setSelectedPreserveEmptyAndNull(!selectedPreserveEmptyAndNull)} inputProps={{"aria-label": "ant design"}}
                                defaultChecked={selectedPreserveEmptyAndNull}/>
                        <Typography style={{fontSize: 12}}>Preserve Empty Arrays</Typography>
                    </Stack>
                }
 */
