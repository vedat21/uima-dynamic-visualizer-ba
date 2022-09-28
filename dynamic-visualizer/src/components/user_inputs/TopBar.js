import React, {useState} from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import {Box, Button, IconButton, TextField, Tooltip} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

// custom modules
import SelectContainer from "./SelectContainer";
import {usedColors} from "../../helper/envConst";
import Sidebar from "./Sidebar";

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

            {
                props.useCase == "navigation" &&
                <Sidebar useCase="navigation" sx={{flexGrow: 1}}></Sidebar>
            }
            {
                props.editable && props.useCase == "presentation" &&
                <Sidebar handleSelectedDocuments={props.handleSelectedDocuments}
                         handleUnselectGroup={props.handleUnselectGroup}
                         handleSelectGroup={props.handleSelectGroup}

                         selectedDocuments={props.selectedDocuments}
                         useCase="presentation" sx={{flexGrow: 1}}></Sidebar>
            }
            {/* topbar */}
            <Toolbar>
              {!props.editable &&
                  <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography
                        variant="h4"
                        component="div"
                    >
                      {props.title}
                    </Typography>
                  </Box>
              }
              {props.editable &&
                    <Tooltip title={'Press enter to save Title'}>
                      <TextField
                          defaultValue={props.title}
                          onKeyDown={props.editTitle}
                          sx={{
                            flexGrow: 1,
                            mx: 5,
                            input: {color: usedColors.secondary}
                          }}
                      />
                    </Tooltip>
              }

              {/* button to enable/disable editor modus. Only renders if topbar has prop editable */}
              {props.editable != null &&
                  <Tooltip title={'Also saves the current Presentation'}>
                    <Button
                        color={props.editable ? "inherit" : "inherit"}
                        variant={props.editable ? "contained" : "text"}
                        onClick={props.onEditableClicked}
                    >
                      EDIT
                    </Button>
                  </Tooltip>
              }

              {/* button to add a new presentation. Only renders if topbar has no prop editable */}
              {props.editable == null &&
                  <Button
                      onClick={props.addPresentation}
                      color="inherit"
                  > Add Presentation</Button>
              }
            </Toolbar>
            {/* input area for creating new visualization */}
            {props.editable && <SelectContainer
                addVisualization={props.addVisualization}
            />}
          </AppBar>
        </HideOnScroll>
        <Toolbar/> {/* Damit Header unteren content nicht überdeckt */}
      </React.Fragment>
  );
}

export default TopBar;