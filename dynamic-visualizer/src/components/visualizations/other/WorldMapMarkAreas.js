import React from "react";

import WorldMapDetailed from "./helper/WorldMapDetailed";

export default function WorldMapMarkAreas(props) {

  return (
      <WorldMapDetailed markArea="administrative_area_level_1" {...props}/>
  );
}
