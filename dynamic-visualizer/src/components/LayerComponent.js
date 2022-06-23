import React, {useState} from "react";
import {Grid, IconButton, TextField} from "@mui/material";
import {Delete, DeleteForever, Edit} from "@mui/icons-material";
import {v4 as uuid} from 'uuid';

// custom modules
import AllVisualizationComponents from "./AllVisualizationComponents";


function LayerComponent(props) {

    const DEFAULTLIMIT = 5;
    const basisUrl = "http://localhost:9999/result/";


    const [label, setLabel] = useState("Label")
    const [limit, setLimit] = useState(DEFAULTLIMIT)
    const [editLabel, setEditLabel] = useState(false);
    const [url, setUrl] = useState(basisUrl + props.block.targetData + "/" + DEFAULTLIMIT)

    /**
     * enables/disables edit of label
     */
    function reverseEditLabel() {
        setEditLabel(!editLabel);
    }

    /**
     * changes label of chart with input of event e when enter is pressed
     * @param e
     */
    function changeLabel(e) {
        if (e.keyCode == 13) {
            setLabel(e.target.value);
        }
    }

    /**
     * changes limit of data that is shown chart with input of event e when enter is pressed
     * @param e
     */
    function changeLimit(e) {
        if (e.keyCode == 13) {
            if (e.target.value) {
                setLimit(e.target.value);
                setUrl(basisUrl + props.block.targetData + "/" + e.target.value)
            } else {
                setLimit(DEFAULTLIMIT);
                setUrl(basisUrl + props.block.targetData + "/" + DEFAULTLIMIT)
            }

        }

    }

    return (
        //TODO Eigene Kompononte für topbar
        <div key={uuid()}>
            {
                props.editable &&
                <IconButton onClick={props.onDeleteComponentClicked}>
                    <DeleteForever/>
                </IconButton>
            }
            {
                props.editable &&
                <IconButton onClick={reverseEditLabel}>
                    <Edit/>
                </IconButton>
            }
            {
                editLabel &&
                <TextField
                    onKeyDown={changeLabel}
                    key={uuid()}
                    size="small"
                    label="Label"
                    id="outlined-basic"
                    variant="outlined"
                    autoComplete="off"
                />
            }
            {
                props.editable &&
                <TextField
                    key={uuid()}
                    className="chart-filter-field"
                    id="outlined-basic"
                    variant="outlined"
                    type="number"
                    min="0"
                    size="small"
                    label="Limit"
                    defaultValue={limit}
                    onKeyDown={changeLimit}
                    autoComplete="off"
                />
            }

            {/* Die Visualisierung selber  */}
            {AllVisualizationComponents(props.block, props.editable, label, url)}
        </div>
    );
}

export default LayerComponent;