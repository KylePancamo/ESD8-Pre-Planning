import React, { useState } from "react";
import Popup from './components/Popup/MarkerPopupWindow';
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
  OverlayView,
  DrawingManager,
  StandaloneSearchBox,
} from "@react-google-maps/api";

import Axios from "axios";
import './useStateWithCallback'
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

function MyComponent(props) {
  const [libraries] = useState(["drawing", "places"]);
  const [activeMarker, setActiveMarker] = useState(false);
  const [markerLoc, setMarkerLoc] = useStateWithCallback(0);
  const [markers, setMarkers] = useState([
    {
      marker_name: "default",
      latitude: 0,
      longitude: 0,
      icon_id: 0,
    }
  ]);
  const [marker, setMarker] = useState({
    marker_name: "default",
    latitude: 0,
    longitude: 0,
    icon_id: 0,
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
  }

  const FlushMarkers = () => {
    Axios.delete("http://localhost:5000/api/deleteMarkers").then((response) => {
      console.log(response);
      setMarkers([]);
    }).catch((err) => {
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
        let markerId = 0;
        marker.position = {
          lat: marker.latitude,
          lng: marker.longitude,
        };
        markerId++;
        return (
          <Marker
            key={markerId}
            position={marker.position}
            onClick={() => {
              if (markerClicked === false) {
                setMarkerClicked(true);
              }
              setMarker(marker);
            }}
            icon={{
              url: "https://cdn-icons-png.flaticon.com/512/394/394565.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        );
      })}
      <Popup
        show={markerClicked}
        onHide={() => setMarkerClicked(false)}
        marker={marker}
      />
      <Marker
        position={center}
        onClick={() => handleOnClick()}
        draggable={true}
        label={
          (window.google.maps.MarkerLabel = {
            text: "ESD8",
            fontSize: "12px",
          })
        }
      >
        {activeMarker === true ? (
          <InfoWindow onCloseClick={() => setActiveMarker(false)}>
            <div style={divStyle}>
              <h1>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                convallis pretium fermentum. Cras sagittis, libero quis maximus
                sagittis, magna velit pulvinar tellus, a tincidunt magna tellus
                a est. Aliquam pretium eros lectus. Nunc elit lorem, imperdiet
                malesuada iaculis vel, pellentesque non enim. In lobortis nibh
                at libero vulputate, laoreet ullamcorper arcu elementum. Morbi
                faucibus vel urna nec iaculis. Donec sit amet tempus lectus.
                Nunc pulvinar ex quis interdum elementum.
              </h1>
            </div>
          </InfoWindow>
        ) : null}
      </Marker>

      <DrawingManager
        onMarkerComplete={(marker) => {
          const position = marker.position;
          Axios.post("http://localhost:5000/api/setMarkerInfo", { position })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
            
          marker.addListener("click", () => {
            let position = marker.position;
            Axios.get("http://localhost:5000/api/getMarkerInfo")
              .then((response) => {
                response.data.forEach((locationInfo) => {
                  if (locationInfo.latitude == position.lat().toFixed(8) && locationInfo.longitude == position.lng().toFixed(8)) {
                    if (markerClicked === false) {
                      setMarkerClicked(true);
                    }
                    setLocation(locationInfo);
                    
                  }
                });
              })
              .catch((error) => {
                console.log(error);
            });
          });
        }}
        options={
          {
            drawingControlOptions:{
              drawingModes: ['marker']
            }
          }
        }
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
      <AdminPanel
        flushMarkers={() => FlushMarkers()}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
