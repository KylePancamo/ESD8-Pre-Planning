import React, { useState } from "react";
import Popup from "./components/Popup/MarkerPopupWindow";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
  OverlayView,
  DrawingManager,
  Polygon,
  StandaloneSearchBox,
} from "@react-google-maps/api";

import Axios from "axios";
import "./useStateWithCallback";
import useStateWithCallback from "./useStateWithCallback";
import GenericPopupWindow from "./components/Popup/GenericPopup";
import AdminPanel from "./components/AdminPanel/AdminPanel";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 29.615106009353045,
  lng: -98.68537740890328,
};

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
};

// const paths = [
//   { lat: 25.774, lng: -80.19 },
//   { lat: 18.466, lng: -66.118 },
//   { lat: 32.321, lng: -64.757 },
//   { lat: 25.774, lng: -80.19 }
// ]

function MyComponent(props) {
  const [libraries] = useState(["drawing", "places"]);
  const [activeMarker, setActiveMarker] = useState(false);
  const [markerLoc, setMarkerLoc] = useStateWithCallback(0);
  const [drawManagerMarker, setDrawManagerMarker] = useState();
  const [markers, setMarkers] = useState([
    {
      marker_id: 0,
      marker_name: "default",
      latitude: 0,
      longitude: 0,
      file_name: "",
    },
  ]);
  const [selectedMarker, setSelectedMarker] = useState({
    marker_id: 0,
    marker_name: "default",
    latitude: 0,
    longitude: 0,
    file_name: "",
  });

  const [center, setCenter] = useState({
    lat: 29.615106009353045,
    lng: -98.68537740890328,
  });

  const [markerClicked, setMarkerClicked] = useState(false);

  const [searchBox, setSearchBox] = useState(null);
  const [bounds, setBounds] = useState(null);

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    props.setSearchedSite(places[0].formatted_address);

    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    const nextMarkers = places.map((place) => ({
      position: place.geometry.location,
    }));
    const nextCenter =
      nextMarkers.length > 0 ? nextMarkers[0].position : center;

    setCenter(nextCenter);
    props.setSideBarValue(true);
  };

  const onSBLoad = (ref) => {
    setSearchBox(ref);
  };

  const { isLoaded } = useJsApiLoader({
    version: "weekly",
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    placeMarkers();
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const placeMarkers = () => {
    Axios.get("http://localhost:5000/api/getMarkerInfo")
      .then((res) => {
        setMarkers(res.data);
      })
      .catch((err) => {});
  };

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleOnClick = () => {
    props.setSideBarValue(!props.sideBarValue);
  };

  let MapStyle = [
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];

  const setLocation = (marker) => {
    setMarkerLoc(marker);
  };

  const FlushMarkers = () => {
    Axios.delete("http://localhost:5000/api/deleteMarkers")
      .then((response) => {
        console.log(response);
        setMarkers([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => {
        setActiveMarker(false);
      }}
      options={{
        styles: MapStyle,
      }}
    >
      {markers.map((marker) => {
        marker.position = {
          lat: parseFloat(marker.latitude),
          lng: parseFloat(marker.longitude),
        };
        return (
          <Marker
            position={marker.position}
            onClick={() => {
              if (markerClicked === false) {
                setMarkerClicked(true);
              }
              setSelectedMarker(marker);
            }}
            icon={"/images/" + marker.file_name}
            key={marker.marker_id}
          />
        );
      })}
      <Popup
        show={markerClicked}
        onHide={() => setMarkerClicked(false)}
        selectedMarker={selectedMarker}
        markers={markers}
        setSelectedMarker={setSelectedMarker}
        setMarkers={setMarkers}
      />
      <Marker
        position={center}
        onClick={() => handleOnClick()}
        draggable={true}
        label={
          (window.google.maps.MarkerLabel = {
            text: "ESD8",
            fontSize: "10px",
          })
        }
      />

      <DrawingManager
        onMarkerComplete={(marker) => {
          const position = marker.position;
          marker.setIcon(
            "/images/edit_location_FILL0_wght400_GRAD0_opsz48.png"
          );
          // Make marker transition little nicer with timeout
          setTimeout(() => {
            marker.setMap(null);
          }, 500);
          Axios.post("http://localhost:5000/api/setMarkerInfo", { position })
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

      <StandaloneSearchBox
        bounds={bounds}
        onPlacesChanged={onPlacesChanged}
        onLoad={onSBLoad}
      >
        <input
          type="text"
          placeholder="Search for a location"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            minWidth: `15vw`,
            height: `3vh`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            textOverflow: `ellipses`,
            position: `absolute`,
            left: `40vw`,
            top: `5%`,
          }}
        />
      </StandaloneSearchBox>
      <AdminPanel flushMarkers={() => FlushMarkers()} />
      
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
