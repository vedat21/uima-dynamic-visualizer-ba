import React, {useState} from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import {Button} from "@mui/material";

// custom modules
import SelectContainer from "./SelectContainer";
import {colorHexcode} from "../../helper/colorHexcode";


/**
 * Quelle: https://mui.com/material-ui/react-app-bar/
 */
function HideOnScroll(props) {
    const {children, window} = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

/**
 * Topbar Komponente für Präsentationsmodus
 * @param props
 * @returns {JSX.Element}
 * @constructor
 * Quelle: https://mui.com/material-ui/react-app-bar/
 */
function TopBar(props) {
    return (
        <React.Fragment>
            <CssBaseline/>
            <HideOnScroll {...props}>
                <AppBar sx={{backgroundColor: colorHexcode.primary}}>
                    <Toolbar>
                        <Typography variant="h5" component="div" sx={{flexGrow: 1}}> {/* buttons on the right */}
                            Dokument X
                        </Typography>
                        {/* editor modus button */}
                        <Button
                            color={props.editable ? "inherit" : "inherit"}
                            variant={props.editable ? "contained" : "text"}
                            onClick={props.reverseEditable}
                        >
                            Edit
                        </Button>
                    </Toolbar>
                    {/* input area for creating new visualization */}
                    {props.editable && <SelectContainer addToBodyData={props.addToBodyData}
                    />}
                </AppBar>
            </HideOnScroll>
            <Toolbar/> {/* Damit Header unteren content nicht überdeckt */}
        </React.Fragment>
    );
}

export default TopBar;