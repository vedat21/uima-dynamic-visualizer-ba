import {useEffect, useState} from "react";
import useGetData from "../../api_crud/useGetData";
import {apiEndpoints} from "../../helper/envConst";
import Typography from "@mui/material/Typography";
import {Checkbox, FormControlLabel} from "@mui/material";

function DocumentsCheckBox(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.documents + apiEndpoints.all
      + apiEndpoints.namesandgroup);

  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState({});

  useEffect(async () => {

    let optionsCopy = {};
    if (!loading) {

      response.forEach((document) => {
        optionsCopy[document.group] = [];
      })

      response.forEach((document) => {
        optionsCopy[document.group].push(document.name)
        if (!options.includes(document.name)) { // gegen duplikate
          options.push(document.name)
        }
      })

      setOptions1(optionsCopy);

    }
  }, [response, loading])

  return (
      <>
        <Typography variant="h5">Documents</Typography>
        <br/>
        <>
          {loading === false && Object.values(options1).map((value, index) => (
              <div key={index}>
                <FormControlLabel
                    control=
                        {<Checkbox checked={props.selectedDocuments.includes(value[0])}/>}
                    label={value[0]}
                    onChange=
                        {(event) => props.handleSelectedDocuments(event, value[0])}
                >

                </FormControlLabel>
              </div>
          ))}
        </>
      </>
  );
}

export default DocumentsCheckBox