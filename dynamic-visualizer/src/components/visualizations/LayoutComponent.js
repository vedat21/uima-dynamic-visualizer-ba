import React, {useState} from "react";

// custom modules
import AllVisualizationComponents from "./AllVisualizationComponents";


function LayoutComponent(props) {


    const DEFAULTLIMIT = 5;
    const DEFAULTLABEL = "No Lable";

    // if visualization is new created then use default limit and label
    const [label, setLabel] = useState(props.block.label ? props.block.label : DEFAULTLABEL);
    const [limit, setLimit] = useState(props.block.limit ? props.block.limit : DEFAULTLIMIT);
    const [inputLabelAndLimit, setInputLabelAndLimit] = useState(false);


    /**
     * enables/disables textarea for setting label/limit
     */
    function handleOnClickInput() {
        setInputLabelAndLimit(!inputLabelAndLimit);
    }

    /**
     * change label of chart with input of textfield
     * @param event
     */
    function changeLabel(event) {
        if (event.keyCode === 13) {
            setLabel(event.target.value);
            props.block.label = event.target.value;
        }
    }

    /**
     * change filter for minimal occurence of target
     * @param event
     */
    function changeLimit(event) {
        if (event.keyCode === 13) {
            if (event.target.value) {
                setLimit(event.target.value);
                props.block.limit = event.target.value;

            } else {
                setLimit(DEFAULTLIMIT);
            }
        }
    }

    return (
        <>
            {/* Die Visualisierung selber  */}
            {AllVisualizationComponents(props.block, props.editable, props.onDeleteComponentClicked, limit, label,
                changeLimit, changeLabel, inputLabelAndLimit, handleOnClickInput)}
        </>
    );
}

export default LayoutComponent;