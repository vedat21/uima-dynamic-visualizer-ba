import React from "react";
import {IconButton, TextField} from "@mui/material";
import {DeleteForever, Edit} from "@mui/icons-material";
import {v4 as uuid} from 'uuid';


import AllVisualizationComponents from "../../AllVisualizationComponents";

/**
 * topbar of chart component. Gives possibility to edit the chart or remove it
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TextTopBar(props) {
    return (
        <>
            {
                props.editable &&
                <IconButton onClick={props.onDeleteComponentClicked}>
                    <DeleteForever/>
                </IconButton>
            }
        </>
    );
}

export default TextTopBar;