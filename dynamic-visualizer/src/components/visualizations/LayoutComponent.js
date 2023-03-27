import React, {useState} from "react";

// custom modules
import AllVisualizationComponents from "./AllVisualizationComponents";
import TestLegend from "../../TestLegend";

function LayoutComponent(props) {

    const [richTextContent, setRichTextContent] = useState(
        props.visualization.content ? props.visualization.content : "x");


    function editRichtext(content) {
        props.visualization.content = content;
    }

    return (
        <>
            {/* Die Visualisierung selber  */}
            {AllVisualizationComponents(props.visualization, props.editable, props.onDeleteComponentClicked,
                editRichtext, richTextContent, props.selectedDocuments, props.lemmaBegin, props.setLemmaBegin, props.lemmaEnd, props.setLemmaEnd, props.editVisualization)}
        </>
    );
}

export default LayoutComponent;
