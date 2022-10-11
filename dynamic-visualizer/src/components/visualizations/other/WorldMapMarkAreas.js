import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";

import GeoTest from "./helper/WorldMapBasis";

export default function WorldMapMarkAreas(props) {

  const [content, setToolTipContent] = useState("");


  return (
      <div>
        <GeoTest markArea="administrative_area_level_1" setTooltipContent={setToolTipContent} {...props}/>
        <ReactTooltip>{content}</ReactTooltip>
      </div>
  );
}
