import React from "react";
import {
    DrawingManagerF,
  } from "@react-google-maps/api";
import Axios from "axios";
import { useEffect } from "react";
import config from "../../config/config";
import { marker } from "../../types/marker-types";
import { useRecoilState } from "recoil";
import { defaultMarkerIconExistsState } from "../../atoms";

type MapDrawingManagerProps = {
  markers: marker[];
  setMarkers: React.Dispatch<React.SetStateAction<marker[]>>;
};

function MapDrawingManager({ markers, setMarkers } : MapDrawingManagerProps) {

  const [fileExists, setFileExists] = useRecoilState(defaultMarkerIconExistsState);

  return (
    <DrawingManagerF
      onMarkerComplete={(marker: google.maps.Marker) => {
        if (fileExists) {
          marker.setIcon(
            "./icon_images/" + config.DEFAULT_MARKER_NAME
          ); 
          
        }
        const position = marker.getPosition();
        // Make marker transition little nicer with timeout
        setTimeout(() => {
          marker.setMap(null);
        })
        const payload = {
          position: position,
          fileName: config.DEFAULT_MARKER_NAME,
          fileExists: fileExists,
        }
        Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/insert-placed-marker", {
            payload,
        }, {
          withCredentials: true,
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
                    file_name: fileExists ? config.DEFAULT_MARKER_NAME : "",
                    position: {
                      lat: Number(response.data.payload.latitude),
                      lng: Number(response.data.payload.longitude),
                    },
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
                  file_name: fileExists ? config.DEFAULT_MARKER_NAME : "",
                  position: {
                    lat: Number(response.data.payload.latitude),
                    lng: Number(response.data.payload.longitude),
                  },
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
          drawingModes: [google.maps.drawing.OverlayType.MARKER]
        },
      }}
    />
  );
}

export default MapDrawingManager;