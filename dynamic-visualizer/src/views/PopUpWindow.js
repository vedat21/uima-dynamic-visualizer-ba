import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SelectionContainer from "../components/user_inputs/SelectionContainer";
import {Button, IconButton} from "@mui/material";
import {Edit} from "@mui/icons-material";
import React from "react";

export default function PopUpWindow(props) {

    return (
        <>
            {
                props.isEdit
                    ? <Popup trigger={<IconButton><Edit/></IconButton>} modal closeOnDocumentClick>
                        {close => (
                            <SelectionContainer text="Update Visiualization" closeModal={close} editVisualization={props.editVisualization} {...props}/>
                        )}
                    </Popup>
                    : <Popup trigger={<Button style={{backgroundColor: "#00618F", color: "#faf9f7"}}> Create new Visualization</Button>} modal closeOnDocumentClick>
                        {close => (
                            <SelectionContainer text="Create Visualization" closeModal={close} addVisualization={props.addVisualization}/>
                        )}
                    </Popup>
            }
        </>
    )
}
