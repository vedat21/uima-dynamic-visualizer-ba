import React from "react";
import {IconButton, Tooltip} from "@mui/material";
import {DeleteForever} from "@mui/icons-material";
import PopUpWindow from "../../../views/PopUpWindow";


/**
 * topbar of a chart component. gives possibility to edit or remove the chart
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ChartTopBar(props) {
    return (
        <>
            {
                props.editable && // only show topbar when editor modus is enabled
                <>
                    <Tooltip title={"Delete visualization"}>
                        <IconButton onClick={props.onDeleteComponentClicked}>
                            <DeleteForever/>
                        </IconButton>
                    </Tooltip>
                    <PopUpWindow visualizationId={props.id} isEdit={true} editVisualization={props.editVisualization} {...props}></PopUpWindow>
                </>
            }
        </>
    );
}

export default ChartTopBar;
