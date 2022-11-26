import MapStandaloneSearchBox from "./MapStandaloneSearchBox";
import MapDrawingManager from "./MapDrawingManager";
import React, { useState } from "react";
import Popup from "../Popup/MarkerPopupWindow";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import Axios from "axios";
import "../../useStateWithCallback";
import useStateWithCallback from "../../useStateWithCallback";
import AdminPanel from "../AdminPanel/AdminPanel";
import Form from "react-bootstrap/Form";

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

function MapContainer(props) {
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
  const [markerVisibility, setMarkerVisibility] = useState(true);
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
    Axios.get("http://localhost:5000/api/fetch-placed-markers")
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
    Axios.delete("http://localhost:5000/api/delete-all-markers")
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
            icon={"/icon_images/" + marker.file_name}
            key={marker.marker_id}
            visible={markerVisibility}
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
        drawManagerMarker={drawManagerMarker}
      />
      <Marker position={center} onClick={() => handleOnClick()} />

      <MapDrawingManager setMarkers={setMarkers} />

      <MapStandaloneSearchBox
        bounds={bounds}
        onPlacesChanged={onPlacesChanged}
        onSBLoad={onSBLoad}
      />
      <AdminPanel flushMarkers={() => FlushMarkers()} />
      <div className="marker-visiblity">
        <Form>
          <Form.Check
            type="switch"
            label="Marker Visibility"
            checked={markerVisibility}
            onChange={() => setMarkerVisibility(!markerVisibility)}
          />
        </Form>
      </div>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapContainer);
