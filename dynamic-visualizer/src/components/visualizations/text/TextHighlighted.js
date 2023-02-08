import {useEffect, useState} from "react";
import Highlight from "react-highlight-words"

import useGetData from "../../../api_crud/useGetData";
import {apiEndpoints} from "../../../helper/envConst";


export default function TextHighlighted(props) {

    const {response: responseText, loading} = useGetData(
        apiEndpoints.basis + apiEndpoints.text +
        props.selectedDocuments.toString());

    const {response: responseData} = useGetData(
         props.url +
        props.selectedDocuments.toString());

    const [wordsToHighlight, setWordsToHighlight] = useState([])

    const [text, setText] = useState("Loading Text");

    useEffect(async () => {

            if (props.selectedDocuments.length > 1) {
                setText(
                    "More then 1 Document selected. Cant display text of multiple documents.")
                return
            } else if (props.selectedDocuments.length === 0) {
                setText(
                    "No document selected")
                return
            }

            if (!loading) {
                let tx = ""
                let lastLemmaEnd = responseText[0]["begin"];
                responseText.forEach((lemma) => {
                    for (let i = 0; i < (lemma.begin - lastLemmaEnd); i++) {
                        tx = tx + " ";
                    }
                    tx = tx + lemma.value;

                    lastLemmaEnd = lemma.end;
                })
                setText(tx)


                responseData.forEach((data) => {
                   wordsToHighlight.push(data.id)
                })
            }
        },
        [responseText, loading]
    )

    return (
        <Highlight
            highlightClassName="highlight"
            searchWords={loading ? [] : wordsToHighlight}
            autoEscape={true}
            caseSensitive={true}
            textToHighlight={loading ? [] : text}
            unhighlightStyle={{fontFamily: "sans-serif"}}
            highlightedStyle={{fontFamily: "sans-serif"}}
        />
    )
}
