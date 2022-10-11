import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";

import WorldMapBasis from "./helper/WorldMapBasis";

export default function WorldMapMarkCities(props) {

  const [content, setContent] = useState("");


  return (
      <div>
        <WorldMapBasis markArea="locality"  setTooltipContent={setContent} {...props}/>
        <ReactTooltip className="tooltip">{content}</ReactTooltip>
      </div>
  );
}
