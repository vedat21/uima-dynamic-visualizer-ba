import React, {useState} from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import {Button, IconButton, TextField} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

// custom modules
import SelectContainer from "./SelectContainer";
import {usedColors} from "../../helper/usedConst";


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
 * Topbar Komponente. Wird genutzt für NavigationView und Documentwindow
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
                <AppBar sx={{backgroundColor: usedColors.primary}}>
                    <Toolbar>
                        <Typography variant="h5" component="div" sx={{flexGrow: 1}}> {/* buttons on the right */}
                            {props.title}
                            { props.editable &&
                                <IconButton>
                                    <EditIcon onClick={props.editTitle} sx={{color: usedColors.secondary}}/>
                                </IconButton>
                            }
                        </Typography>
                        {props.editable == null &&
                            <Button
                                onClick={props.addPresentation}
                                color="inherit"
                            > Add Presentation</Button>
                        }

                        {/* editor modus button für documentview. wird nur gerendert wenn props editable übergeben wird */}
                        {props.editable != null && <Button
                            color={props.editable ? "inherit" : "inherit"}
                            variant={props.editable ? "contained" : "text"}
                            onClick={props.onEditableClicked}
                        >
                            Edit
                        </Button>
                        }
                    </Toolbar>
                    {/* input area for creating new visualization */}
                    {props.editable && <SelectContainer addVisualization={props.addVisualization}
                    />}
                </AppBar>
            </HideOnScroll>
            <Toolbar/> {/* Damit Header unteren content nicht überdeckt */}
        </React.Fragment>
    );
}

export default TopBar;