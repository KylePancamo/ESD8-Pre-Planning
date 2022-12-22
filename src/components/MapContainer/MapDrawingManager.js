import React from "react";
import {
    DrawingManager,
  } from "@react-google-maps/api";
import Axios from "axios";
function MapDrawingManager({
    markers,
    setMarkers,
}) {
  return (
    <DrawingManager
      onMarkerComplete={(marker) => {
        const position = marker.position;
        marker.setIcon(
          "/icon_images/edit_location_alt_FILL0_wght400_GRAD0_opsz48.png"
        ); 
        // Make marker transition little nicer with timeout
        setTimeout(() => {
          marker.setMap(null);
        }, 500);
        Axios.post("http://localhost:5000/api/insert-placed-marker", {
          position,
        })
          .then((response) => {

            if (markers) {
              setMarkers((markers) => {
                let newMarkers = [
                  ...markers,
                  {
                    marker_id: response.data.payload.marker_id,
                    marker_name: response.data.payload.marker_name,
                    latitude: parseFloat(response.data.payload.latitude),
                    longitude: parseFloat(response.data.payload.longitude),
                    icon_id: 10,
                    image: null,
                    file_name: "edit_location_alt_FILL0_wght400_GRAD0_opsz48.png",
                  }
                ]
                localStorage.setItem("markers", JSON.stringify(newMarkers));
                return newMarkers;
              });
            } else {
              setMarkers(() => {
                let newMarker = [{
                  marker_id: response.data.payload.marker_id,
                  marker_name: response.data.payload.marker_name,
                  latitude: parseFloat(response.data.payload.latitude),
                  longitude: parseFloat(response.data.payload.longitude),
                  icon_id: 10,
                  image: null,
                  file_name: "edit_location_FILL0_wght400_GRAD0_opsz48.png",
                }]
                localStorage.setItem("markers", JSON.stringify(newMarker));
                return newMarker;
            })
            }
          }).catch((error) => {
            console.log(error);
          });
      }}
      options={{
        drawingControlOptions: {
          drawingModes: ["marker"],
        },
      }}
    />
  );
}

export default MapDrawingManager;