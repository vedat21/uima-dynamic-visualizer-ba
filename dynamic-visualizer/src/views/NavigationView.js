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
import {IconButton} from "@mui/material";
import {DeleteForever} from "@mui/icons-material";


// custom modules
import TopBar from "../components/user_inputs/TopBar";
import savePresentation from "../api_crud/savePresentation";
import deletePresentation from "../api_crud/deletePresentation";
import {apiEndpoints} from "../helper/envConst";


/**
 * view to select, add or remove presentations.
 * @returns {JSX.Element}
 * @constructor
 */
function NavigationView() {

    // hook that is used for rooting
    const navigate = useNavigate();

    const topBarTitle = "Presentations";
    const [response, setResponse] = useState([]);


    // fetch data from api
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(apiEndpoints.basis + apiEndpoints.presentations).then((response) => {
                    setResponse(response.data)
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
        savePresentation({"title": "No Title", "layout": [], "visualizations": []});

    }

    /**
     * to delete a presentation
     * @param id
     */
    function removePresentation(id) {
        deletePresentation(id);
    }


    return (
        <>
            <TopBar addPresentation={addPresentation} title={topBarTitle}></TopBar>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">

                    <TableHead>
                        <TableRow>
                            <TableCell style={{borderColor: "black", fontSize: "x-large"}}>Title</TableCell>
                            <TableCell style={{borderColor: "black", fontSize: "x-large"}}>Visualizations</TableCell>
                            <TableCell style={{borderColor: "black"}} algin="right"></TableCell>
                            <TableCell style={{borderColor: "black"}} algin="right"></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {response.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.visualizations ? row.visualizations.length : 0}</TableCell>
                                <TableCell algin="right">
                                    <IconButton onClick={() => navigate("/presentation/" + row.id)}> {/* navigate to presentation view with id */}
                                        <LaunchIcon></LaunchIcon>
                                    </IconButton>
                                </TableCell>
                                <TableCell algin="right">
                                    <IconButton onClick={() => removePresentation(row.id)}>
                                        <DeleteForever></DeleteForever>
                                    </IconButton>
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