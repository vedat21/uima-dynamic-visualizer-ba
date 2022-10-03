import React, {useState} from "react";

// custom modules
import AllVisualizationComponents from "./AllVisualizationComponents";

function LayoutComponent(props) {

  const DEFAULTLIMIT = 5;
  const DEFAULTLABEL = "Default Label";

  // if visualization is new created then use default limit and label
  const [label, setLabel] = useState(
      props.visualization.label ? props.visualization.label : DEFAULTLABEL);
  const [limit, setLimit] = useState(
      props.visualization.limit ? props.visualization.limit : DEFAULTLIMIT);
  const [richTextContent, setRichTextContent] = useState(
      props.visualization.content ? props.visualization.content : " ");
  const [inputLabelAndLimit, setInputLabelAndLimit] = useState(false);


  /**
   * enables/disables textarea for setting label/limit
   */
  function handleOnClickInput() {
    setInputLabelAndLimit(!inputLabelAndLimit);
  }

  /**
   * change label of chart with input of textfield
   * @param event
   */
  function changeLabel(event) {
    if (event.keyCode === 13) {
      setLabel(event.target.value);
      props.visualization.label = event.target.value;
    }
  }

  /**
   * change filter for minimal occurence of target
   * @param event
   */
  function changeLimit(event) {
    if (event.keyCode === 13) {
      if (event.target.value) {
        setLimit(event.target.value);
        props.visualization.limit = event.target.value;
      } else {
        setLimit(DEFAULTLIMIT);
      }
    }
  }

  function editRichtext(content) {
    props.visualization.content = content;
  }


  return (
      <>
        {/* Die Visualisierung selber  */}
        {AllVisualizationComponents(props.visualization, props.editable,
            props.onDeleteComponentClicked, limit, label,
            changeLimit, changeLabel, inputLabelAndLimit, handleOnClickInput,
            editRichtext, richTextContent, props.selectedDocuments, props.lemmaBegin, props.setLemmaBegin, props.lemmaEnd, props.setLemmaEnd)}
      </>
  );
}

export default LayoutComponent;