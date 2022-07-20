import React, {useState} from "react";
import {Box, Button} from "@mui/material";
import SelectField from "./SelectField";


const optionsVisualization = [
    {value: 'barchart', label: 'Bar Chart'},
    {value: 'bubblechart', label: 'Bubble Chart'},
    {value: 'doughnutchart', label: 'Doughnut Chart'},
    {value: 'linechart', label: 'Line Chart'},
    {value: 'piechart', label: 'Pie Chart'},
    {value: 'polarareachart', label: 'Polar Area Chart'},
    {value: 'scatterchart', label: 'Scatter Chart'},
    {value: 'radarchart', label: 'Radar Chart'},
    {value: "textarea", label: "Text Area"},
    {value: 'textcomponent', label: 'Text'},
    {value: "testchart", label: "Testchart"}
];
// Todo soll dynmisch sein von api abfragen
const optionsData = [
    {value: 'pos', label: 'PoS Distribution'},
    {value: 'token', label: 'Token Distribution'},
    {value: 'entity', label: 'Entity Distribution'},
];


/**
 * container for number of input select.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectContainer(props) {

    // darin wird die userauswahl für einen neuen chart gespeichert
    const [selectedVisualization, setSelectedVisualization] = useState(optionsVisualization[0].value);
    const [selectedData, setSelectedData] = useState(optionsData[0].value);

    return (
        <Box display="flex" sx={{m: 2}}>
            <SelectField options={optionsVisualization} selectedOption={selectedVisualization} setSelectedOption={setSelectedVisualization}/>
            <SelectField options={optionsData} selectedOption={selectedData} setSelectedOption={setSelectedData}/>
            <Button color="inherit" onClick={() => props.addVisualization(selectedVisualization, selectedData)}>+Create</Button>
        </Box>
    )
}

export default SelectContainer;