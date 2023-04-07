import MapStandaloneSearchBox from "./MapStandaloneSearchBox";
import MapDrawingManager from "./MapDrawingManager";

import React, { useState, useCallback, useEffect } from "react";
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
import CurrentUserLocation from "../CurrentUserLocation"
import MapCreateMarker from "../MapCreateMarker";

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

  const [markerClicked, setMarkerClicked] = useState<boolean>(false);
  const [markerVisibility, setMarkerVisibility] = useState<boolean>(true);
  const [markerDraggable, setMarkerDraggable] = useState<boolean>(false);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const [bounds, setBounds] = useState<bounds>();
  const [searchedSite, setSearchedSite] = useRecoilState(searchSiteState);
  const [mapId, setMapId] = useState<string | undefined>("satellite");
  const [currentUserLocation, setCurrentUserLocation] = useState<center>();
  const [trackingLocation, setTrackingLocation] = useState<boolean>(false);
  const [trackingLocationId, setTrackingLocationId] = useState<number | null>();
  const [isCreateMarkerUIVisible, setIsCreateMarkerUIVisible] = useState<boolean>(false);

  const [occupancyLocation,  setOccupancyLocation] = useState<center>({
    lat: 29.615106009353045,
    lng: -98.68537740890328,
  })
  const [center, setCenter] = useState<center>(currentUserLocation ? currentUserLocation : occupancyLocation);

  const { userData, logout } = useAuth();
  const searchBoxRef = React.useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        );
      });
    }
  }, []);

  useEffect(() => {
    if (trackingLocation) {
      const id: number = navigator.geolocation.watchPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        setCurrentUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, (error) => {
        console.log(error);
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
      setTrackingLocationId(id);
    } else {
      navigator.geolocation.clearWatch(trackingLocationId as number);
      setTrackingLocationId(null);
    }

    return () => {
      console.log(trackingLocationId)
      if (trackingLocationId) {
        navigator.geolocation.clearWatch(trackingLocationId);
      }
    }
  }, [trackingLocation]);

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
    console.log(localMarkers);
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
      setMarkers(JSON.parse(localStorage.getItem("markers") || ""));
    }
  };

  console.log(markers)

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

  const updateUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, (error) => {
        console.log(error);
      });
    }
  }

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
              draggable={markerDraggable}
              onDragEnd={(e) => {
                console.log(e?.latLng?.lat(), e?.latLng?.lng());
              }}
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

      {/* Marker for occupancy location */}
      <Marker 
        position={occupancyLocation} 
        onClick={() => handleOnClick()}
        icon={"map-pin.png"}
        />

      {/* Marker for users location */}
      {currentUserLocation ? (
        <Marker
          position={currentUserLocation}
          icon={"/icon_images/user_location.png"}
          onMouseOver={() => {

          }}
        />
      ) : null}
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
        <div className="marker-draggable">
          <Form>
            <Form.Check
              type="switch"
              label="Marker Draggable"
              style={
                mapId !== "satellite" && mapId !== "hybrid" ? { color: "black" } : { color: "white", backgroundColor: "black", borderRadius: "10px",border: "5px solid black" }
              }
              checked={markerDraggable}
              onChange={() => setMarkerDraggable(!markerDraggable)}
            />
          </Form>
        </div>
        <div className="track-user-location">
          <Form>
            <Form.Check
              type="switch"
              label="Track Location"
              style={
                mapId !== "satellite" && mapId !== "hybrid" ? { color: "black" } : { color: "white", backgroundColor: "black", borderRadius: "10px",border: "5px solid black" }
              }
              checked={trackingLocation}
              onChange={() => setTrackingLocation(!trackingLocation)}
            />
          </Form>
        </div>
        <div className="update-user-location">
          <Button
            onClick={updateUserLocation}
          >
            Update Location
          </Button>
        </div>
        <div className="goto-center">
          <Button
            onClick={() => {
              map?.panTo(occupancyLocation as google.maps.LatLng | google.maps.LatLngLiteral);
              map?.setZoom(15);
            }}
          >
            Goto Location
          </Button>
        </div>
      </div>
      <PreplanningLocationsUI
        setSideBarValue={props.setSideBarValue}
        setOccupancyLocation={setOccupancyLocation}
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
      <CurrentUserLocation
        lat={currentUserLocation?.lat as number | (() => number)}
        lng={currentUserLocation?.lng as number | (() => number)}
        setCenter={setCenter}
      />
      {isCreateMarkerUIVisible === false ? (
        <Button 
          className="create-marker-trigger d-inline-flex"
          onClick={() => setIsCreateMarkerUIVisible(true)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            height="30"
            viewBox="0 96 960 960"
            width="30"
          >
            <path d="M728 413.333h66.667V288H920v-66.667H794.667V96H728v125.333H602.667V288H728v125.333Zm-247.941
            156q30.274 0 51.774-21.559t21.5-51.833q0-30.274-21.559-51.774t-51.833-21.5q-30.274 0-51.774 21.559t-21.5
            51.833q0 30.274 21.559 51.774t51.833 21.5ZM480 976Q319 839 239.5 721.5T160 504q0-150 96.5-239T480 176q14.667
            0 28.445 1.167 13.778 1.166 27.555 3.5V249q-13.333-3.334-27.166-4.834-13.834-1.5-28.834-1.5-106.611 0-179.973
            73.237Q226.666 389.14 226.666 504q0 73.667 63 169.834Q352.667 770 480 888.001 609.334 770 671.334 673.834q62-96.167
            62-169.834 0-6-.334-12-.333-6-1-12h67.333q.667 6 .667 12v12q0 100-79.5 217.5T480 976Zm0-488.334Z"/>
          </svg>
        </Button>
      ) : isCreateMarkerUIVisible === true ? (
        <MapCreateMarker
          setIsCreateMarkerUIVisible={setIsCreateMarkerUIVisible}
          setMarkers={setMarkers}
          markers={markers}
        />
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapContainer);
