import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LaunchIcon from '@mui/icons-material/Launch';
import {IconButton, Tooltip} from "@mui/material";
import {ContentCopy, DeleteForever} from "@mui/icons-material";

// custom modules
import TopBar from "../components/user_inputs/TopBar";
import savePresentation from "../api_crud/savePresentation";
import deletePresentation from "../api_crud/deletePresentation";
import {apiEndpoints} from "../helper/envConst";
import copyPresentation from "../api_crud/copyPresentation";

/**
 * view to select, add or remove presentations.
 * @returns {JSX.Element}
 * @constructor
 */
function NavigationView() {

  // hook that is used for rooting
  const navigate = useNavigate();

  const topBarTitle = "Presentations";
  const defaultPresentationTitle = "Title";

  const [response, setResponse] = useState([]);

  // fetch data from api
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(apiEndpoints.basis + apiEndpoints.presentations).then(
            (responseFromAPI) => {
              if (responseFromAPI.data !== response) {
                setResponse(responseFromAPI.data)
              }
            });
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [response])

  /**
   * to add a new empty presentation
   */
  function addPresentation() {
    savePresentation({
      "title": defaultPresentationTitle,
      "layout": [],
      "visualizations": [],
      "documents": []
    });
  }

  function handleCopyPresentation(id) {
    copyPresentation(id);
  }

  /**
   * to delete a presentation
   * @param id
   */
  function handleRemovePresentation(id) {
    deletePresentation(id);
  }

  return (
      <>

        <TopBar useCase="navigation" addPresentation={addPresentation}
                title={topBarTitle}></TopBar>

        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">

            <TableHead>
              <TableRow>
                <TableCell style={{
                  borderColor: "black",
                  fontSize: "x-large"
                }}>Title</TableCell>
                <TableCell style={{
                  borderColor: "black",
                  fontSize: "x-large"
                }}>Visualizations</TableCell>
                <TableCell style={{borderColor: "black"}}
                           algin="right"/>
                <TableCell style={{borderColor: "black"}}
                           algin="right"/>
                <TableCell style={{borderColor: "black"}}
                           algin="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {response.map((row) => (
                  <TableRow
                      key={row.id}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.visualizations ? row.visualizations.length
                        : 0}</TableCell>
                    <TableCell algin="right">
                      <Tooltip title="Open Presentation">
                        <IconButton onClick={() => navigate("/presentation/"
                            + row.id)}> {/* navigate to presentation view with id */}
                          <LaunchIcon></LaunchIcon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell algin="right">
                      <Tooltip title="Copy Presentation">
                        <IconButton onClick={() => handleCopyPresentation(row.id)}>
                          <ContentCopy></ContentCopy>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell algin="right">
                      <Tooltip title="Delete Presentation">
                        <IconButton onClick={() => handleRemovePresentation(row.id)}>
                          <DeleteForever></DeleteForever>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </>
  );

}

export default NavigationView;