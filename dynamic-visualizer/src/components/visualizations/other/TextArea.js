import React, {useState} from "react";
import {Button} from "@mui/material";

function TextArea() {

    const [editable, setEditable] = useState(true);

    return (
        <>
            <Button onClick={() => setEditable(!editable)}>Text</Button>
            <textarea readOnly={editable}></textarea>
        </>
    )
}

export default TextArea;