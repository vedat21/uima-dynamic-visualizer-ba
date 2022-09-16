import {useEffect, useState} from "react";
import useGetData from "../../../api_crud/useGetData";
import {apiEndpoints} from "../../../helper/envConst";
import Typography from "@mui/material/Typography";

function DocumentsCheckBox() {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.documents + apiEndpoints.all
      + apiEndpoints.ids);

  // options and selectedOptions
  const [options, setOptions] = useState([]);
  const [checked, setChecked] = useState([]); // soll von weiter oben kommen und in collection presentation gespeichert werden

  // lade alle ids
  useEffect(async () => {
    if (!loading) {
      response.forEach((document) => {
        if(!options.includes(document.id)){ // sonst duplikate
          options.push(document.id)
        }
      })
    }
  }, [response,loading])

  // funktion von hier https://contactmentor.com/checkbox-list-react-js-example/
  const handleCheck = (event) => {
    let updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };


  return (
      <>
        <Typography variant="h5">Documents</Typography>
        <br/>
        <>
          {loading == false && options.map((item, index) => (
              <div key={index}>
                <input value={item} type="checkbox" onChange={handleCheck}/>
                <span>{item}</span>
              </div>
          ))}
        </>
      </>
  );
}

export default DocumentsCheckBox