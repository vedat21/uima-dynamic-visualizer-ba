import React from "react";
import {IconButton, TextField, Tooltip} from "@mui/material";
import {DeleteForever, Edit} from "@mui/icons-material";
import {v4 as uuid} from 'uuid';


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
              <Tooltip title={"Click for editing title/limit"}>
                <IconButton onClick={props.reverseEditLabel}>
                  <Edit/>
                </IconButton>
              </Tooltip>
              {/* displays textfield for setting label or for setting minimal occurence of data */}
              {props.editLabel &&
                  <Tooltip title={"Press enter to save title"}>
                    <TextField
                        key={uuid()}
                        size="small"
                        label="Label"
                        id="outlined-basic"
                        variant="outlined"
                        autoComplete="off"
                        defaultValue={props.label}
                        onKeyDown={props.changeLabel}
                    />
                  </Tooltip>
              }
              {!props.editLabel &&
                  <Tooltip title={"Press enter to submit filter"}>
                    <TextField
                        key={uuid()}
                        id="outlined-basic"
                        variant="outlined"
                        size="small"
                        label="Limit"
                        autoComplete="off"
                        type="number"
                        min="0"
                        onKeyDown={props.changeLimit}
                        defaultValue={props.limit}
                    />
                  </Tooltip>

              }
            </>
        }
      </>
  );
}

export default ChartTopBar;