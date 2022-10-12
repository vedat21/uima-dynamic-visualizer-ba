import React, {memo, useEffect, useState} from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography, Marker
} from "react-simple-maps";

import {apiEndpoints} from "../../../../helper/envConst";
import useGetData from "../../../../api_crud/useGetData";

/**
 * from https://codesandbox.io/s/3fn8g?file=/src/MapChart.js:1685-2083
 */
function WorldMapBasis(props) {

  const [markers, setMarkers] = useState([]);
  let requestUrl = apiEndpoints.basis + apiEndpoints.sumLocation
      + apiEndpoints.requestParamNames +
      props.selectedDocuments.toString() + apiEndpoints.requestParamLimit
      + props.limit;

  if (props.lemmaEnd != 0 && props.selectedDocuments.length == 1) {
    requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end="
        + props.lemmaEnd;
  }

  const {response: location, loading} = useGetData(requestUrl);

  useEffect(async () => {

    if (!loading && markers.length === 0) {

      let numberOfMentions = 0;
      location.forEach(location => {
        numberOfMentions = numberOfMentions + location.count;
      })

        location.forEach(location => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address="
            + location.id + "&key=AIzaSyD-pP1KijYI-S9fttH5Hu3j_gMZf7ynx6Q")
        .then((response) => {
          return response.json();
        }).then(jsonData => {
          if (jsonData.status !== "ZERO_RESULTS"
              && jsonData.results[0].types.includes(props.markArea)) {
            setMarkers(markers => [...markers, {
              name: location.id,
              coordinates: [jsonData.results[0].geometry.location.lng,
                jsonData.results[0].geometry.location.lat],
              size : ((location.count - 1) / (numberOfMentions - 1)) *10,
              count: location.count
            }])
          }
          console.log(((location.count - 1) / (numberOfMentions - 1)) *100)
        })
        .catch(error => {
          console.log(error);
        })
      })
      console.log(markers)
    }
  }, [location, loading])

  return (
      <div data-tip="">
        <ComposableMap>
          <ZoomableGroup maxZoom={15}>
            <Geographies geography="/feature.json">
              {({geographies}) =>
                  geographies.map((geo) => (
                      <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: "#E0D7D5",
                              outline: "none"
                            },
                            hover: {
                              fill: "#000000",
                              outline: "none"
                            },
                            pressed: {
                              fill: "#000000",
                              outline: "none"
                            }
                          }}
                      />
                  ))
              }
            </Geographies>
            {markers.length !== 0 && markers.map(marker => (
                <Marker
                    onMouseEnter={() => {
                      props.setTooltipContent(marker.name + ": " + marker.count);
                    }}
                    onMouseLeave={() => {
                      props.setTooltipContent("");
                    }}
                    key={marker.name} coordinates={marker.coordinates}>
                  <circle r={marker.size < 0.45 ? 0.45 : marker.size} fill="#F00"/>
                </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
  );
};

export default memo(WorldMapBasis);
