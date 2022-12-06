import MapStandaloneSearchBox from "./MapStandaloneSearchBox";
import MapDrawingManager from "./MapDrawingManager";
import React, { useState } from "react";
import Popup from "../Popup/MarkerPopupWindow";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import Axios from "axios";
import "../../useStateWithCallback";
import useStateWithCallback from "../../useStateWithCallback";
import AdminPanel from "../AdminPanel/AdminPanelModal";
import Form from "react-bootstrap/Form";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";


const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function MapContainer(props) {
  const [libraries] = useState(["drawing", "places"]);
  const [drawManagerMarker, setDrawManagerMarker] = useState();
  const [markers, setMarkers] = useState(undefined);
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
  const [searchedSite, setSearchedSite] = useRecoilState(searchSiteState);
  const [mapId, setMapId] = useState("satellite");

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    setSearchedSite(places[0].formatted_address);

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
    let localMarkers = JSON.parse(localStorage.getItem("markers"));
    // fetch data if local storage is empty
    if (localMarkers == null) {
      console.log('fetching markers');
      Axios.get("http://localhost:5000/api/fetch-placed-markers")
        .then((res) => {
          if (res.data.length > 0) {
            setMarkers(res.data);
          }
        })
        .catch((err) => {});
    } else {
      console.log('using local markers');
      setMarkers(JSON.parse(localStorage.getItem("markers")));
    }
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

  const FlushMarkers = () => {
    Axios.delete("http://localhost:5000/api/delete-all-markers")
      .then((response) => {
        console.log(response);
        setMarkers([]);
        localStorage.clear();
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
      options={{
        styles: MapStyle,
      }}
      onMapTypeIdChanged={() => {
        setMapId(map ? map.getMapTypeId() : "roadmap");
      }}
    >
      {console.log(mapId)}
      {markers ? (
          markers.map((marker) => {
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
          })
        ) : null 
    }
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

      <MapDrawingManager markers={markers} setMarkers={setMarkers} />

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
            style={
              mapId !== "satellite" && mapId !== "hybrid" ? { color: "black" } : { color: "white", backgroundColor: "black", borderRadius: "10px",border: "5px solid black" }
            }
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
