import {slide as Menu} from 'react-burger-menu'
import React, {useState} from "react";
import {
  Button, Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Tooltip
} from "@mui/material";

// custom
import {usedColors, apiEndpoints} from "../../helper/envConst"
import DocumentsCheckBox from "./DocumentsCheckBox";
import importDocuments from "../../api_crud/importDocuments";

function Sidebar(props) {

  const [files, setFiles] = useState([]);
  const [open, setOpen] = React.useState(false);

  function deleteAllDocuments() {
    handleClose();
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChange(event) {
    setFiles(event.target.files)
  }

  // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
  return (
      <>
        {/* Sidebar für Navigation View */}
        {
            props.useCase == "navigation" &&
            <Menu styles={stylesNavigation}>
              <input type="file" id="ctrl" webkitdirectory directory multiple
                     onChange={handleChange}
              />
              <Tooltip placement="top"
                       title={"Enter group name to bundle documents"}>
                <TextField sx={{background: usedColors.secondary}} label="Groupname"
                           autoComplete="off" size="small"
                       />
              </Tooltip>
              <br/>
              <br/>

              <Button
                  variant="outlined"
                  sx={{color: "black", backgroundColor: usedColors.secondary}}
                  onClick={() => importDocuments(files)}
              >
                Import Documents
              </Button>
              <Button
                  variant="outlined"
                  sx={{color: "black", backgroundColor: usedColors.secondary}}
                  onClick={handleClickOpen}
              >
                Delete Documents
              </Button>
              <br/>
              <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                {"Delete all Documents"}
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Will delete all Documents that are currently stored in
                    database
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Disagree</Button>
                  <Button onClick={deleteAllDocuments} autoFocus>
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>
            </Menu>
        }
        {/* Sidebar für Presentation View */}
        {
            props.useCase == "presentation" &&
            <Menu styles={stylesPresentation}>
              <DocumentsCheckBox
                  handleSelectedDocuments={props.handleSelectedDocuments}
                  selectedDocuments={props.selectedDocuments}
              />
            </Menu>
        }
      </>
  );
}

export default Sidebar;

const stylesPresentation = {
  zIndex: 1,
  bmBurgerButton: {
    position: 'fixed',
    width: '30px',
    height: '25px',
    left: '20px',
    top: '20px'
  },
  bmBurgerBars: {
    background: usedColors.secondary,
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    width: "50%"
  },
  bmMenu: {
    background: usedColors.primary,
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: usedColors.secondary
  }
}

const stylesNavigation = {
  zIndex: 1,
  bmBurgerButton: {
    position: 'fixed',
    width: '30px',
    height: '25px',
    left: '20px',
    top: '20px'
  },
  bmBurgerBars: {
    background: usedColors.secondary,
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: usedColors.primary,
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: usedColors.secondary
  }
}