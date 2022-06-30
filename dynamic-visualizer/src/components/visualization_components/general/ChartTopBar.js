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
function ChartTopBar(props) {
    return (
        <>
            {
                props.editable &&
                <IconButton onClick={props.onDeleteComponentClicked}>
                    <DeleteForever/>
                </IconButton>
            }
            {
                props.editable &&
                <IconButton onClick={props.reverseEditLabel}>
                    <Edit/>
                </IconButton>
            }
            {
                props.editable && props.editLabel && // not editable
                <TextField
                    onKeyDown={props.changeLabel}
                    key={uuid()}
                    size="small"
                    label="Label"
                    id="outlined-basic"
                    variant="outlined"
                    autoComplete="off"
                />
            }
            {
                props.editable && !props.editLabel &&
                <TextField
                    key={uuid()}
                    className="chart-filter-field"
                    id="outlined-basic"
                    variant="outlined"
                    type="number"
                    min="0"
                    size="small"
                    label="Limit"
                    defaultValue={props.limit}
                    onKeyDown={props.changeLimit}
                    autoComplete="off"
                />
            }
        </>
    );
}

export default ChartTopBar;