import {useEffect, useState} from "react";
import useGetData from "../../../api_crud/useGetData";
import {apiEndpoints} from "../../../helper/envConst";
import Typography from "@mui/material/Typography";
import {CheckBox} from "@mui/icons-material";
import {Checkbox, FormControlLabel} from "@mui/material";

function DocumentsCheckBox(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.documents + apiEndpoints.all
      + apiEndpoints.ids);

  // options and selectedOptions
  const [options, setOptions] = useState([]);

  // lade alle ids
  useEffect(async () => {
    if (!loading) {
      response.forEach((document) => {
        if (!options.includes(document.id)) { // sonst duplikate
          options.push(document.id)
        }
      })
    }
  }, [response, loading])

  return (
      <>
        <Typography variant="h5">Documents</Typography>
        <br/>
        <>
          {loading == false && options.map((item, index) => (
              <div key={index}>
                <FormControlLabel
                    control={<Checkbox checked={props.documents.includes(item)} />}
                    label={item}
                    onChange={(event) => props.handleCheckedDocuments(event, item)}
                />
              </div>
          ))}
        </>
      </>
  );
}

export default DocumentsCheckBox