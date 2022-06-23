import React from "react";

// Custom Modules
import useGetData from "./scripts/useGetData"

/**
 * component to display a text
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TextComponent(props) {

       const url = "http://localhost:9999/result/text"
       const {data, loading} = useGetData(url);


    return (
        <div className="scrollable-text-wrapper" style={{fontSize: "100%"}}> {/* 100 ist standard */}
                {!loading && data}
        </div>
    )
}

export default TextComponent;

