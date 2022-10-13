import React from "react";

import WorldMapDetailed from "./helper/WorldMapDetailed";

export default function WorldMapMarkCities(props) {

  return (
      <WorldMapDetailed markArea="locality" {...props}/>
  );
}
