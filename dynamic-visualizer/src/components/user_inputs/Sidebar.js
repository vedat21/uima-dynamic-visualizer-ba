import {slide as Menu} from 'react-burger-menu'
import React, {useState} from "react";
import {Button, TextField, Tooltip} from "@mui/material";

// custom
import {usedColors, apiEndpoints} from "../../helper/envConst"
import zIndex from "@mui/material/styles/zIndex";
import DocumentsCheckBox from "./helper/DocumentsCheckBox";

function Sidebar(props) {

  const [path, setPath] = useState("");

  function importDocuments() {
    if (path != "" && path.includes("/")) {
      // hier dokumenten aus path importieren und verarbeiten
      console.log(path);
    }
  }

  // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
  return (
      <>
        {
            props.useCase == "navigation" &&
            <Menu styles={styles}>
              <Tooltip placement="top" title={"Enter path to folder"}>
                <TextField sx={{background: usedColors.secondary}} label="path"
                           autoComplete="off" size="small"
                           onChange={(e) => setPath(
                               e.target.value)}></TextField>
              </Tooltip>
              <br/>
              <Tooltip title="Overrides Database">
                <Button variant="outlined" sx={{color: "black"}}
                        onClick={importDocuments}>Import Documents</Button>
              </Tooltip>
            </Menu>
        }
        {
            props.useCase == "presentation" &&
            <Menu styles={styles}>
              <DocumentsCheckBox handleCheckedDocuments={props.handleCheckedDocuments}  documents={props.documents}></DocumentsCheckBox>
            </Menu>
        }
      </>
  );
}

export default Sidebar;

const styles = {
  zIndex: 1,
  bmBurgerButton: {
    position: 'fixed',
    width: '30px',
    height: '25px',
    left: '20px',
    top: '20px'
  },
  bmBurgerBars: {
    background: usedColors.secondary
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