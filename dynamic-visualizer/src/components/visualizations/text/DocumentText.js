import {useEffect, useState} from "react";
import useGetData from "../../../api_crud/useGetData";
import {apiEndpoints} from "../../../helper/envConst";
import {TextareaAutosize, TextField} from "@mui/material";

function DocumentText(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.text +
      props.selectedDocuments.toString());

  const [text, setText] = useState("FAILURE: EXACTLY ONE DOCUMENT HAS TO BE SELECTED");

  useEffect(async () => {

    if (props.selectedDocuments.length > 1 || props.selectedDocuments.length == 0){
      return
    }
    let tx = ""
    if (!loading) {
      response.forEach((lemma) => {
        tx = tx + lemma.value + " ";
      })
      setText(tx)
    }
  }, [response, loading])
  return (
      <div>
        <TextareaAutosize sx={{paddingBottom : 20}}
            value={text}
            maxRows={20}
        />
      </div>
  )
}

export default DocumentText;