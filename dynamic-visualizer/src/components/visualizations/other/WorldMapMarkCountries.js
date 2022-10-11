import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";

import WorldMapBasisCountries from "./helper/WorldMapBasisCountries";

export default function WorldMapMarkCountries(props) {

  const [content, setToolTipContent] = useState("");


  return (
      <div>
        <WorldMapBasisCountries markArea="country"  setTooltipContent={setToolTipContent} {...props}/>
        <ReactTooltip>{content}</ReactTooltip>
      </div>
  );
}
