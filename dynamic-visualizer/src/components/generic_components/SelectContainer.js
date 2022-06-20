import React, {useState} from "react";
import SelectTest from "./SelectField";
import {Box, Button} from "@mui/material";
import SelectField from "./SelectField";

/**
 * container for number of input select.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SelectContainer(props) {

    // darin wird die userauswahl für einen neuen chart gespeichert
    const [selectedVisualization, setSelectedVisualization] = useState(null);
    const [selectedData, setSelectedData] = useState(null);


    /**
     * updates the visualization that are shown in visualizationLayer
     */
    function addToBodyData() {
        props.saveLayout();

        const dataToAdd = {
            component: selectedVisualization,
            dataUrl: selectedData,
        };
        const newBodyData = props.bodyData.concat([dataToAdd]); //damit änderung neu gerendert wird so umständlich
        props.setBodyData(newBodyData);
    }

    return (
        <Box display="flex" sx={{m: 2}}>
            <SelectField selectedOption={selectedVisualization} setSelectedOption={setSelectedVisualization}/>
            <SelectField selectedOption={selectedData} setSelectedOption={setSelectedData}/>
            <Button color="inherit" onClick={() => addToBodyData()}>+Create</Button>
        </Box>
    )
}

export default SelectContainer;