import MapStandaloneSearchBox from "./MapStandaloneSearchBox";
import MapDrawingManager from "./MapDrawingManager";

import React, { useState, useCallback } from "react";
import Popup from "../Popup/MarkerPopupWindow";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import Axios from "axios";
import AdminPanel from "../AdminPanel/AdminPanelModal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import {sideBarDataState} from "../../atoms";
import {siteIsSetState} from "../../atoms";
import PreplanningLocationsUI from "./PreplanningLocationsUI";
import { useAuth } from "../../hooks/AuthProvider";
import { permission } from "../../permissions";
import { hasPermissions } from '../../helpers';
import { SearchSite } from "../../types/atoms-types";
import { marker } from "../../types/marker-types";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

type center = google.maps.LatLng | google.maps.LatLngLiteral;
type bounds = google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | undefined
type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
type MapContainerProps = {
  sideBarValue: boolean;
  setSideBarValue: React.Dispatch<React.SetStateAction<boolean>>;
};

function MapContainer(props : MapContainerProps) {
  const [libraries] = useState<Libraries>(["drawing", "places"]);
  const [drawManagerMarker, setDrawManagerMarker] = useState();
  const [markers, setMarkers] = useState<marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<marker>({
    marker_id: 0,
    marker_name: "default",
    latitude: 0,
    longitude: 0,
    icon_id: 0,
    file_name: "",
    image: null,
    position: {
      lat: 0,
      lng: 0,
    }
  });

  const [center, setCenter] = useState<center>({
    lat: 29.615106009353045,
    lng: -98.68537740890328,
  });

  const [markerClicked, setMarkerClicked] = useState<boolean>(false);
  const [markerVisibility, setMarkerVisibility] = useState<boolean>(true);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [bounds, setBounds] = useState<bounds>();
  const [searchedSite, setSearchedSite] = useRecoilState(searchSiteState);
  const [mapId, setMapId] = useState<string | undefined>("satellite");
  const { userData, logout } = useAuth();
  const searchBoxRef = React.useRef(null);

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      const bounds = new window.google.maps.LatLngBounds();
      
      if (!places || !places[0]) {
        return;
      }

      setSearchedSite({
        location: places[0].formatted_address as string,
        latitude: places[0].geometry?.location?.lat() as number,
        longitude: places[0].geometry?.location?.lng() as number,
      });

      places.forEach((place) => {

        if (place?.geometry?.viewport) {
          bounds.union(place.geometry.viewport);
        } else if (place?.geometry?.location){
          bounds.extend(place.geometry.location);
        }
      });

      const nextMarkers = places.map((place) => ({
        position: place?.geometry?.location,
      }));

      const nextCenter: center = nextMarkers.length > 0 ? nextMarkers[0].position as center : center;
      setCenter(nextCenter);
      props.setSideBarValue(true);
    }
  };

  const [sidebarData, setSidebarData] = useRecoilState(sideBarDataState);
  const [siteIsSet, setSiteIsSet] = useRecoilState(siteIsSetState);
  const clearPlaces = () => {
    setSearchedSite({
      location: "",
      latitude: 0,
      longitude: 0,
    });
    setSidebarData([])
    setSiteIsSet(false);
    props.setSideBarValue(false);
  }

  const onSBLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const { isLoaded } = useJsApiLoader({
    version: "weekly",
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY as string | "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    placeMarkers();
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const placeMarkers = () => {
    let localMarkers = JSON.parse(localStorage.getItem("markers") as string);
    // fetch data if local storage is empty
    if (localMarkers == null) {
      console.log('fetching markers');
      Axios.get("http://localhost:5000/api/fetch-placed-markers", {
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.payload.length > 0) {
            setMarkers(res.data.payload);
            localStorage.setItem("markers", JSON.stringify(res.data.payload));
          }
        })
        .catch((err) => {});
    } else {
      console.log('using local markers');
      if (localStorage.getItem("markers") === null) {
        setMarkers(JSON.parse(localStorage.getItem("markers") || ""));
      }
    }
  };

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
    Axios.delete("http://localhost:5000/api/delete-all-markers", {
      withCredentials: true,
    })
      .then((response) => {
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
        setMapId(map ? map.getMapTypeId(): "roadmap");
      }}
    >
      {markers ? (
          markers.map((marker) => {
          marker.position = {
            lat: marker.latitude,
            lng: marker.longitude,
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
              icon={(marker.file_name === null) ? undefined : "/icon_images/" + marker.file_name}
              key={marker.marker_id}
              visible={markerVisibility}
            />
          );
          })
        ) : null 
    }
    {markerClicked ? (
      <Popup
        show={markerClicked}
        onHide={() => setMarkerClicked(false)}
        selectedMarker={selectedMarker}
        markers={markers}
        setSelectedMarker={setSelectedMarker}
        setMarkers={setMarkers}
      />
      ) : null}
      <Marker 
        position={center} 
        onClick={() => handleOnClick()}
        icon={"map-pin.png"}
        />
      {hasPermissions(userData?.permissions, permission.MODIFY) ? (
        <MapDrawingManager markers={markers} setMarkers={setMarkers} />
      ) : null}

      <MapStandaloneSearchBox
        bounds={bounds}
        onPlacesChanged={onPlacesChanged}
        onSBLoad={onSBLoad}
        clearPlaces={clearPlaces}
        searchBoxRef={searchBoxRef}
      />
      <AdminPanel flushMarkers={() => FlushMarkers()} />
      <div className="utility-items">
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
        <div className="goto-center">
          <Button
            onClick={() => {
              map?.panTo(center as google.maps.LatLng | google.maps.LatLngLiteral);
              map?.setZoom(15);
            }}
          >
            Goto Center
          </Button>
        </div>
      </div>
      <PreplanningLocationsUI
        setSideBarValue={props.setSideBarValue}
        setCenter={setCenter}
      />
        <button onClick={async () => {
          const response = await Axios.get("http://localhost:5000/api/logout", { withCredentials: true });
          if (response.data.status === "success") {
            logout();
          }
        }} className="logout-btn">
          Logout
        </button>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapContainer);
