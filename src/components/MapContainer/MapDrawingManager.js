import React from "react";
import {
    DrawingManager,
  } from "@react-google-maps/api";
import Axios from "axios";
import { useEffect } from "react";
import config from "../../config/config";
function MapDrawingManager({
    markers,
    setMarkers,
}) {

  const [fileExists, setFileExists] = React.useState(false);
  useEffect(() => {
    checkFileExists();
  }, [])

  const checkFileExists = async () => {
      const response = await Axios.get('http://localhost:5000/api/check-file', {
        params: {
          fileName: config.DEFAULT_MARKER_NAME,
        },
      }).then((response) => {
        if (response?.data.status === "success") {
          setFileExists(true);
        }
      }).catch((error) => {
        console.log(error.message);
      });
    }

  return (
    <DrawingManager
      onMarkerComplete={(marker) => {
        if (fileExists) {
          marker.setIcon(
            "/icon_images/" + config.DEFAULT_MARKER_NAME
          ); 
          
        }
        const position = marker.position;
        // Make marker transition little nicer with timeout
        marker.setMap(null);
        const payload = {
          position: position,
          fileName: config.DEFAULT_MARKER_NAME,
          fileExists: fileExists,
        }
        Axios.post("http://localhost:5000/api/insert-placed-marker", {
            payload,
        })
          .then((response) => {
            console.log(response.data.payload);
            if (markers) {
              setMarkers((markers) => {
                let newMarkers = [
                  ...markers,
                  {
                    marker_id: response.data.payload.marker_id,
                    marker_name: response.data.payload.marker_name,
                    latitude: parseFloat(response.data.payload.latitude),
                    longitude: parseFloat(response.data.payload.longitude),
                    icon_id: response.data.payload.icon_id,
                    image: null,
                    file_name: fileExists ? config.DEFAULT_MARKER_NAME : null,
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
                  icon_id: response.data.payload.icon_id,
                  image: null,
                  file_name: fileExists ? config.DEFAULT_MARKER_NAME : null,
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