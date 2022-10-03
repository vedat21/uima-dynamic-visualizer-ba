import {useEffect, useState} from "react";
import useGetData from "../../../api_crud/useGetData";
import {apiEndpoints} from "../../../helper/envConst";
import TextSelector from 'text-selection-react'

function DocumentText(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.text +
      props.selectedDocuments.toString());

  const [text, setText] = useState("Loading Text");

  useEffect(async () => {

    if (props.selectedDocuments.length > 1 || props.selectedDocuments.length
        == 0) {
      setText(
          "More then 1 Document selected. Cant display text of multiple documents.")
      return
    }
    if (!loading) {
      let tx = ""
      let lastLemmaEnd = response[0]["begin"];
      response.forEach((lemma) => {
        for (let i = 0; i < (lemma.begin - lastLemmaEnd); i++) {
          tx = tx + " ";
        }
        tx = tx + lemma.value;

        lastLemmaEnd = lemma.end;
      })
      setText(tx)
    }
  }, [response, loading])

  function handleSelectedText(selectedText) {


    console.log(0 + "   " + props.lemmaBegin);
    console.log(props.lemmaBegin + "   " + props.lemmaEnd);
    console.log(props.lemmaEnd + "   " + text.length);

    console.log(selectedText)

    const begin = text.indexOf(selectedText);
    const end = begin + selectedText.length;


    props.setLemmaBegin(begin);
    props.setLemmaEnd(end);
  }

  return (
      <>
        <TextSelector
            events={[
              {
                text: 'Select',
                handler: (html, selectedText) => handleSelectedText(
                    selectedText),
              }
            ]}
        />
        <div>
          <span> {text.slice(0, props.lemmaBegin)}</span>
          <span style={{backgroundColor: "yellow"}}> {text.slice(props.lemmaBegin, props.lemmaEnd)}</span>
          <span> {text.slice(props.lemmaEnd, text.length)}</span>
        </div>
      </>
  )
}

export default DocumentText;