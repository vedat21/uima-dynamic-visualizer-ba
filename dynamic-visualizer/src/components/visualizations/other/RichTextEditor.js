import React from "react";
import {useState} from "react";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import {usedColors} from "../../../helper/envConst";

/**
 *
 */
function RichTextEditor(props) {

  const [editorState, setEditorState] = useState(
      props.content === "x" ? EditorState.createEmpty()
          : EditorState.createWithContent(convertFromRaw(props.content)));

  const onEditorStateChange = (editorState) => {
    props.editRichtext(convertToRaw(editorState.getCurrentContent()));
    setEditorState(editorState);
  };

  return (
      <Editor
          editorStyle={props.editable ? {backgroundColor: "white"}
              : {backgroundColor: usedColors.secondary}}
          editorState={editorState}
          toolbarHidden={!props.editable}
          onEditorStateChange={onEditorStateChange}
      />
  )
}

export default RichTextEditor