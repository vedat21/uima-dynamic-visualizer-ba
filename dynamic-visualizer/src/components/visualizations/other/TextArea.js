import React, {useState} from "react";
import {Button} from "@mui/material";

function TextArea() {

    const [editable, setEditable] = useState(true);

    return (
        <>
            <textarea readOnly={editable}></textarea>
            <Button onClick={() => setEditable(!editable)}>Text</Button>
        </>
    )
}

export default TextArea;