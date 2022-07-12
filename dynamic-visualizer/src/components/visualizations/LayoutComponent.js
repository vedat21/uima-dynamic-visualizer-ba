import React, {useState} from "react";

// custom modules
import AllVisualizationComponents from "./AllVisualizationComponents";


function LayoutComponent(props) {

    const DEFAULTLIMIT = 5;
    const basisUrl = "http://localhost:9999/result/";


    const [label, setLabel] = useState("Label")
    const [limit, setLimit] = useState(DEFAULTLIMIT)
    const [editLabel, setEditLabel] = useState(false);
    const [url, setUrl] = useState(basisUrl + props.block.targetData + "/" + DEFAULTLIMIT)

    /**
     * enables/disables textarea for setting new label
     */
    function reverseEditLabel() {
        setEditLabel(!editLabel);
    }

    /**
     * change label of chart with input of textfield
     * @param event
     */
    function changeLabel(event) {
        if (event.keyCode === 13) {
            setLabel(event.target.value);
        }
    }

    /**
     * change filter for min limit
     * @param event
     */
    function changeLimit(event) {
        if (event.keyCode === 13) {
            if (event.target.value) {
                setLimit(event.target.value);
                setUrl(basisUrl + props.block.targetData + "/" + event.target.value)
            } else {
                setLimit(DEFAULTLIMIT);
                setUrl(basisUrl + props.block.targetData + "/" + DEFAULTLIMIT)
            }
        }
    }

    return (
        <>
            {/* Die Visualisierung selber  */}
            {AllVisualizationComponents(props.block, props.editable, label, url, props.onDeleteComponentClicked,
                changeLimit, editLabel, reverseEditLabel, changeLabel)}
        </>
    );
}

export default LayoutComponent;