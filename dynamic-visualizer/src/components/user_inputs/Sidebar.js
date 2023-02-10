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
import {usedColors} from "../../helper/envConst"
import DocumentsCheckBox from "./DocumentsCheckBox";
import importDocuments from "../../api_crud/importDocuments";
import deleteDocuments from "../../api_crud/deleteDocuments";

function SideBar(props) {

  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState("")

  function deleteAllDocuments() {
    deleteDocuments()
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

  function handleImport() {
    if (group !== "" && files.length !== 0) {
      importDocuments(files, group);
      alert("Documents will be imported. The processing could take a minute.");
      setGroup("")
      setFiles([]);
    } else if (group === "" && files.length === 0) {
      alert("Import was not possible because of missing group and files");
    } else if (group !== "" && files.length === 0) {
      alert("Import was not possible because of missing files");
    } else if (group === "" && files.length !== 0) {
      alert("Import was not possible because of missing group");
    }
  }

  function savePresentation(){
    props.onEditableClicked(false);
  }

  return (
      <>
        {/* SideBar für Navigation View */}
        {
            props.useCase == "navigation" &&
            <Menu styles={stylesNavigation}>
              <input type="file" id="ctrl" webkitdirectory directory multiple
                     onChange={handleChange}
              />
              <Tooltip placement="bottom"
                       title={"Enter group name to bundle documents"}>
                <TextField value={group}
                           onChange={(event) => setGroup(event.target.value)}
                           sx={{background: usedColors.secondary}} label="Group"
                           autoComplete="off" size="small"
                />
              </Tooltip>
              <br/>
              <br/>

              <Button
                  variant="outlined"
                  sx={{color: "black", backgroundColor: usedColors.secondary}}
                  onClick={handleImport}
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
        {/* SideBar für Presentation View */}
        {
            props.useCase == "presentation" &&
            <Menu onStateChange={savePresentation} styles={stylesPresentation}>
              <DocumentsCheckBox
                  handleSelectedDocuments={props.handleSelectedDocuments}
                  handleUnselectGroup={props.handleUnselectGroup}
                  handleSelectGroup={props.handleSelectGroup}
                  selectedDocuments={props.selectedDocuments}
                  onEditableClicked={props.onEditableClicked}
              />
            </Menu>
        }
      </>
  );
}

export default SideBar;

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
