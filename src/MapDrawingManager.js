import React from "react";
import {
    DrawingManager,
  } from "@react-google-maps/api";
import Axios from "axios";
function MapDrawingManager({
    setMarkers,
}) {
  return (
    <DrawingManager
      onMarkerComplete={(marker) => {
        const position = marker.position;
        marker.setIcon(
          "/icon_images/edit_location_FILL0_wght400_GRAD0_opsz48.png"
        ); 
        // Make marker transition little nicer with timeout
        setTimeout(() => {
          marker.setMap(null);
        }, 500);
        Axios.post("http://localhost:5000/api/insert-placed-marker", {
          position,
        })
          .then((response) => {
            // add marker to markers array
            setMarkers((current) => [
              ...current,
              {
                marker_id: response.data.payload.marker_id,
                marker_name: response.data.payload.marker_name,
                latitude: parseFloat(response.data.payload.latitude),
                longitude: parseFloat(response.data.payload.longitude),
                file_name: "edit_location_FILL0_wght400_GRAD0_opsz48.png",
              },
            ]);
          })
          .catch((error) => {
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