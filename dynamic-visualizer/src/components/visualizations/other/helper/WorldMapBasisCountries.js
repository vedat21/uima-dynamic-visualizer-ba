import React, {memo, useEffect, useState} from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography, Marker
} from "react-simple-maps";

import {apiEndpoints, countryCode2to3} from "../../../../helper/envConst";
import useGetData from "../../../../api_crud/useGetData";
import {newShade} from "../../../../helper/generalHelper";

/**
 * author: https://codesandbox.io/s/3fn8g?file=/src/MapChart.js:1685-2083
 * adjusted to my usecase
 */
function WorldMapBasisCountries(props) {

  const [markers, setMarkers] = useState([]);

  const [allMentionedCountryCodes, setAllMentionedCountryCodes] = useState([]);

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
              size: ((location.count - 1) / (numberOfMentions - 1)) * 10,
              count: location.count,
              countryCode: countryCode2to3[jsonData.results[0].address_components[0].short_name]
            }])

            setAllMentionedCountryCodes(
                allMentionedCountryCodes => [...allMentionedCountryCodes,
                  countryCode2to3[jsonData.results[0].address_components[0].short_name]])
          }
        })
        .catch(error => {
          console.log(error);
        })
      })
      console.log(markers.length)

    }
  }, [location, loading])

  return (
      <div data-tip="">
        {allMentionedCountryCodes.length !== 0 &&
            <ComposableMap>
              <ZoomableGroup maxZoom={15}>
                <Geographies geography="/feature.json">
                  {({geographies}) =>
                      geographies.map((geo) => (
                          <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onMouseEnter={() => {
                                props.setTooltipContent(
                                    geo.properties.name  + (markers.find(mark => mark.countryCode == geo.id) ? ": " + markers.find(mark => mark.countryCode == geo.id)["count"] : ""))
                              }}
                              onMouseLeave={() => {
                                props.setTooltipContent("");
                              }}
                              style={{
                                default: {
                                  fill: allMentionedCountryCodes.includes(
                                      geo.id)
                                      ? newShade("#E0D7D5", -markers.find(mark => mark.countryCode == geo.id)["count"]) : "#D3D3D3",
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
              </ZoomableGroup>
            </ComposableMap>
        }
      </div>
  );
};


export default memo(WorldMapBasisCountries);
