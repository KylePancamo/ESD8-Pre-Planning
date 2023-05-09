import MapStandaloneSearchBox from "./MapStandaloneSearchBox";
import MapDrawingManager from "./MapDrawingManager";

import React, { useState, useCallback, useEffect, useRef } from "react";
import MarkerPopupWindow from "../Popup/MarkerPopupWindow";
import { GoogleMap, useJsApiLoader, Marker, MarkerClustererF, InfoWindowF  } from "@react-google-maps/api";
import Legend from "../Legend";
import Axios from "axios";
import AdminPanel from "../AdminPanel/AdminPanelModal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import PreplanningLocationsUI from "./PreplanningLocationsUI";
import PlacedMarkersUI from "./PlacedMarkersUI";
import { useAuth } from "../../hooks/AuthProvider";
import { permission } from "../../permissions";
import { hasPermissions } from '../../helpers';
import { marker } from "../../types/marker-types";
import { CurrentUserLocation, CurrentOccupancyLocation, UpdateUserLocation } from "../VerticalWidgets"
import MapCreateMarker from "../MapCreateMarker";
import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import { LatLngUI } from "./LatLngUI";
import {MdLogout} from "react-icons/md";

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
  const { prePlanningLocations, locationInitalizer } = usePrePlanningLocations();
  const [mapId, setMapId] = useState<string | undefined>("satellite");
  const [currentUserLocation, setCurrentUserLocation] = useState<center>();
  const [trackingLocation, setTrackingLocation] = useState<boolean>(false);
  const [trackingLocationId, setTrackingLocationId] = useState<number | null>();
  const [isCreateMarkerUIVisible, setIsCreateMarkerUIVisible] = useState<boolean>(false);
  const [infoWindow, setInfoWindow] = useState<boolean>(false);
  const accuracyCircle = useRef<google.maps.Circle | null>(null);

  const [occupancyLocation,  setOccupancyLocation] = useState<center>({
    lat: 29.615106009353045,
    lng: -98.68537740890328,
  })
  const [center, setCenter] = useState<center>(currentUserLocation ? currentUserLocation : occupancyLocation);

  const { userData, logout } = useAuth();
  const searchBoxRef = React.useRef(null);

  useEffect(() => {
    if (trackingLocation) {
      const id: number = navigator.geolocation.watchPosition((position) => {
        setCurrentUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        if (accuracyCircle.current) {
          accuracyCircle.current.setMap(null);
        }

        accuracyCircle.current = new google.maps.Circle({
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          radius: position.coords.accuracy,
          fillColor: "#61a0bf",
          fillOpacity: 0.4,
          strokeColor: "#1bb6ff", 
          strokeOpacity: 0.4,
          strokeWeight: 1,
          zIndex: 1,
        });
    
        accuracyCircle.current.setMap(map as google.maps.Map);
      }, (error) => {
        console.log(error);
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
      setTrackingLocationId(id);
    } else {
      navigator.geolocation.clearWatch(trackingLocationId as number);
      setTrackingLocationId(null);
    }

    return () => {
      if (trackingLocationId) {
        navigator.geolocation.clearWatch(trackingLocationId);
      }
    }
  }, [trackingLocation]);


  // Function that gets called when the search box input changes
  const onPlacesChanged = () => {
    if (searchBox) {
      // Get the places from the search box
      const places = searchBox.getPlaces();
      const bounds = new window.google.maps.LatLngBounds();
      
      if (!places || !places[0]) {
        return;
      }
      // Find the pre-planning location that matches the first place in the array
      const location = prePlanningLocations.find((location) => location.google_formatted_address === places[0].formatted_address);

      // If no matching pre-planning location was found, set the searched site as a new location object
      if (!location) {
        setSearchedSite({
          ...locationInitalizer,
          google_formatted_address: places[0].formatted_address as string,
          latitude: places[0]?.geometry?.location?.lat() as number,
          longitude: places[0]?.geometry?.location?.lng() as number,
        });
      } else {
        setSearchedSite(location);
      }

      // Loop through each place and adjust the bounds accordingly
      places.forEach((place) => {
        if (place?.geometry?.viewport) {
          bounds.union(place.geometry.viewport);
        } else if (place?.geometry?.location){
          bounds.extend(place.geometry.location);
        }
      });

      // Create a new array of markers for each place and set the center of the map to the first marker's position
      const nextMarkers = places.map((place) => ({
        position: place?.geometry?.location,
      }));

      const nextCenter: center = nextMarkers.length > 0 ? nextMarkers[0].position as center : center;
      setCenter(nextCenter);

      // Set the occupancy location and show the sidebar
      setOccupancyLocation(nextCenter);
      props.setSideBarValue(true);
    }
  };
  const clearPlaces = () => {
    setSearchedSite(locationInitalizer);
    props.setSideBarValue(false);
  }

  const onSBLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const { isLoaded } = useJsApiLoader({
    version: "weekly",
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API_KEY as string | "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    placeMarkers();
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        if (accuracyCircle.current) {
          accuracyCircle.current.setMap(null);
        }

        accuracyCircle.current = new google.maps.Circle({
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          radius: position.coords.accuracy,
          fillColor: "#61a0bf",
          fillOpacity: 0.4,
          strokeColor: "#1bb6ff", 
          strokeOpacity: 0.4,
          strokeWeight: 1,
          zIndex: 1,
        });
    
        accuracyCircle.current.setMap(map as google.maps.Map);
      });
    }
  }, []);

  const placeMarkers = () => {
    // Access and parse the value of the "markers" key in local storage
    const localMarkers = JSON.parse(localStorage.getItem("markers") as string);

    // If local storage is empty, fetch marker data from the API and set it as markers
    if (localMarkers == null) {
      Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/fetch-placed-markers", {
        withCredentials: true,
      })
        .then((res) => {
          // Check if the response data has a payload with at least one marker
          if (res.data.payload.length > 0) {
            setMarkers(res.data.payload);
            localStorage.setItem("markers", JSON.stringify(res.data.payload));
          }
        })

    // If local storage has a value for "markers", set the state variable "markers" to the value of "markers" in local storage
    } else {
      setMarkers(JSON.parse(localStorage.getItem("markers") || ""));
    }
  };
  
  const handleOnClick = () => {
    props.setSideBarValue(!props.sideBarValue);
  };

  const MapStyle = [
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
    Axios.delete(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/delete-all-markers", {
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

        if (accuracyCircle.current) {
          accuracyCircle.current.setMap(null);
        }

        accuracyCircle.current = new google.maps.Circle({
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          radius: position.coords.accuracy,
          fillColor: "#61a0bf",
          fillOpacity: 0.4,
          strokeColor: "#1bb6ff", 
          strokeOpacity: 0.4,
          strokeWeight: 1,
          zIndex: 1,
        });

        accuracyCircle.current.setMap(map as google.maps.Map);
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

    {markerClicked ? (
      <MarkerPopupWindow
        show={markerClicked}
        onHide={() => setMarkerClicked(false)}
        selectedMarker={selectedMarker}
        markers={markers}
        setSelectedMarker={setSelectedMarker}
        setMarkers={setMarkers}
      />
      ) : null}

      <MarkerClustererF 
        options={{ imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" }}
        maxZoom={18}
        styles={[
          {
            url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
            height: 53,
            width: 53,
            textColor: "white",
            textSize: 16,
          },
        ]}
      >
        {(clusterer) => 
            <div>
              {/* map over the markers array to render individual markers */}
              {markers.map((marker) => {
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
                      onDragEnd={async (e) => {
                        const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/update-map-marker-latlng", {
                          latitude: e?.latLng?.lat().toFixed(8),
                          longitude: e?.latLng?.lng().toFixed(8),
                          markerId: marker.marker_id,
                        },
                        { withCredentials: true }
                        );

                        if (response.data.status === "success") {
                          if (e?.latLng) {
                            setMarkers((markers) => {
                              const updatedMarkers = markers.map((currMarker) => {
                                if (e?.latLng) {
                                  if (currMarker.marker_id === marker.marker_id) {
                                    currMarker.latitude = Number(e.latLng.lat().toFixed(8));
                                    currMarker.longitude = Number(e.latLng.lng().toFixed(8));
                                  }
                                }
                                return currMarker;
                              })
                              localStorage.setItem("markers", JSON.stringify(updatedMarkers));
                              return updatedMarkers;
                            })
                          }
                        }
                      }}
                      clusterer={clusterer}
                    />
                );
              }
              )}
            </div>
        }
      </MarkerClustererF>
      
      {/* Marker for occupancy location */}
      <Marker
        position={occupancyLocation} 
        onClick={() => handleOnClick()}
        icon={"/map-pin.png"}
        />
      
      {/* Marker for users location */}
      {currentUserLocation ? (
        <Marker
          position={currentUserLocation}
          icon={
            {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285F4",
              scale: 8,
              strokeColor: "rgb(255,255,255)",
              strokeWeight: 2,
              fillOpacity: 1,
            }
          }
          onClick={() => setInfoWindow(true)}
        >
          {infoWindow ? (
            <InfoWindowF
              position={currentUserLocation}
              onCloseClick={() => setInfoWindow(false)}
            >
              <div>
                {currentUserLocation?.lat as number},
                <br />
                {currentUserLocation?.lng as number}
              </div>
            </InfoWindowF>
          ) : null}
        </Marker>
      ) : null}
      {hasPermissions(userData?.permissions, permission.MODIFY) ? (
        <MapDrawingManager 
          setMarkers={setMarkers}
        />
      ) : null}

      
      <AdminPanel flushMarkers={() => FlushMarkers()} />
      <div className="utility-items">
        <div className="marker-visiblity">
          <Form>
            <Form.Check
              type="switch"
              id="marker-visibility"
              label={<Form.Label htmlFor="marker-visibility">Marker Visibility</Form.Label>}
              style={
                mapId !== "satellite" && mapId !== "hybrid" ? { color: "black" } : { backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 1px 4px rgb(0, 0, 0, .3)" }
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
              id="marker-draggable"
              label={<Form.Label htmlFor="marker-draggable">Marker Draggable</Form.Label>}
              style={
                mapId !== "satellite" && mapId !== "hybrid" ? { color: "black" } : { backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 1px 4px rgb(0, 0, 0, .3)" }
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
              id="track-user-location"
              label={<Form.Label htmlFor="track-user-location">Track User Location</Form.Label>}
              style={
                mapId !== "satellite" && mapId !== "hybrid" ? { color: "black" } : { backgroundColor: "white", borderRadius: "5px", boxShadow: "0px 1px 4px rgb(0, 0, 0, .3)" }
              }
              checked={trackingLocation}
              onChange={() => setTrackingLocation(!trackingLocation)}
            />
          </Form>
        </div>
      </div>
      <PreplanningLocationsUI
        setSideBarValue={props.setSideBarValue}
        setOccupancyLocation={setOccupancyLocation}
        setCenter={setCenter}
      />
      <PlacedMarkersUI
        markers={markers}
        setCenter={setCenter}
      />
      <Button variant="none" onClick={async () => {
        const response = await Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/logout", { withCredentials: true });
        if (response.data.status === "success") {
          logout();
        }
      }} className="logout-btn">
        <MdLogout
          size={30}
          color="black"
        />
      </Button>
      <MapStandaloneSearchBox
        bounds={bounds}
        onPlacesChanged={onPlacesChanged}
        onSBLoad={onSBLoad}
        clearPlaces={clearPlaces}
        searchBoxRef={searchBoxRef}
      />
      <div className="vertical-widget-holder">
        <CurrentUserLocation
          lat={currentUserLocation?.lat as number | (() => number)}
          lng={currentUserLocation?.lng as number | (() => number)}
          setCenter={setCenter}
        />
        <CurrentOccupancyLocation
          map={map}
          occupancyLocation={occupancyLocation}
        />
        <UpdateUserLocation 
          updateUserLocation={updateUserLocation}
        />
      </div>
      <LatLngUI
        setCenter={setCenter}
      />
      <Legend />
      {isCreateMarkerUIVisible === false ? (
        <Button
          variant="secondary"
          className="create-marker-trigger d-inline-flex"
          onClick={() => setIsCreateMarkerUIVisible(true)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            height="30"
            viewBox="0 96 960 960"
            width="30"
            style={{
              fill: "white",
            }}
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
