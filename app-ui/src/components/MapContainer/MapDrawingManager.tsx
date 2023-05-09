import React from "react";
import {
  DrawingManagerF,
} from "@react-google-maps/api";
import Axios from "axios";
import config from "../../config/config";
import { marker } from "../../types/marker-types";
import { useRecoilState } from "recoil";
import { defaultMarkerIconExistsState } from "../../atoms";

type MapDrawingManagerProps = {
  setMarkers: React.Dispatch<React.SetStateAction<marker[]>>;
};

function MapDrawingManager({ setMarkers }: MapDrawingManagerProps) {

  const [fileExists, setFileExists] = useRecoilState(defaultMarkerIconExistsState);

  const createMarkerAndUpdate = (payload: marker) => {
    const newMarker: marker = {
      marker_id: payload.marker_id,
      marker_name: payload.marker_name,
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      icon_id: payload.icon_id,
      image: null,
      file_name: fileExists ? config.DEFAULT_MARKER_NAME : "",
      position: {
        lat: Number(payload.latitude),
        lng: Number(payload.longitude),
      },
    };

    setMarkers((prevMarkers) => {
      const newMarkers = prevMarkers ? [...prevMarkers, newMarker] : [newMarker];
      localStorage.setItem("markers", JSON.stringify(newMarkers));
      return newMarkers;
    });
  };

  return (
    <DrawingManagerF
      onMarkerComplete={(marker: google.maps.Marker) => {
        if (fileExists) {
          marker.setIcon(
            "./icon_images/" + config.DEFAULT_MARKER_NAME
          );

        }
        const position = marker.getPosition();
        setTimeout(() => {
          marker.setMap(null);
        }, 300);

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
            createMarkerAndUpdate(response.data.payload);
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

export default React.memo(MapDrawingManager);