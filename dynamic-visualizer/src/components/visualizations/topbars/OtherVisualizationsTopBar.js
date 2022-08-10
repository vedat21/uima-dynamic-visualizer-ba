import React from "react";
import {IconButton, TextField} from "@mui/material";
import {DeleteForever, Edit} from "@mui/icons-material";
import {v4 as uuid} from 'uuid';


/**
 * topbar of chart component. Gives possibility to edit the chart or remove it
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function OtherVisualizationsTopBar(props) {
    return (
        <>
            {
                props.editable && // only show topbar when editor modus is enabled
                <IconButton onClick={props.onDeleteComponentClicked}>
                    <DeleteForever/>
                </IconButton>
            }
        </>
    );
}

export default OtherVisualizationsTopBar;