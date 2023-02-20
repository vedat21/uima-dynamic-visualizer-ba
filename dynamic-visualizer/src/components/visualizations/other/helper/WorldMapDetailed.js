import React, {useEffect, useState} from "react";
import {apiEndpoints} from "../../../../helper/envConst";
import useGetData from "../../../../api_crud/useGetData";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

/**
 * from https://codesandbox.io/s/3fn8g?file=/src/MapChart.js:1685-2083
 */
function WorldMapDetailed(props) {

  const minMarkerSize = 0.30;

  const [markers, setMarkers] = useState([]);
  let requestUrl = apiEndpoints.basis + apiEndpoints.sumLocation
      + apiEndpoints.requestParamNames +
      props.selectedDocuments.toString() + apiEndpoints.requestParamMinOccurrence
      + props.selectedMinOccurrence;

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
                coordinates: [jsonData.results[0].geometry.location.lat,
                  jsonData.results[0].geometry.location.lng],
                size : ((location.count - 1) / (numberOfMentions - 1)) *250,
                count: location.count
              }])
            }
            setTimeout(function(){
            }, 250);        })
          .catch(error => {
            console.log(error);
          })
        })
      }
    }, [location, loading])


  return (
      <MapContainer center={[50, 20]} zoom={3}
                    style={props.editable ? {zIndex: -10} : {zIndex: 10}}>
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.length !== 0 && markers.map(marker => (
            <Marker position={marker.coordinates} key={marker.name}>
              <Popup>
                {marker.name + ": " + marker.count}
              </Popup>
            </Marker>
        ))}
      </MapContainer>
  );
};

export default WorldMapDetailed;
