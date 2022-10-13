import React, { useState } from "react";
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
  const [libraries] = useState(["drawing", "places"])
  const [activeMarker, setActiveMarker] = useState(false);
  const [markerLoc, setMarkerLoc] = useState();
  const [markers, setMarkers] = useState([
    { lat: 0, lng: 0 },
    { lat: 0, lng: 0 },
    { lat: 0, lng: 0 },
  ]);
  const [center, setCenter] = useState({
    lat: 29.615106009353045,
    lng: -98.68537740890328,
  });

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
    libraries
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    FlushMarkers();
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

   const FlushMarkers = () => {
    Axios.delete("http://localhost:5000/api/deleteMarkers").then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err);
    });
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
        Axios.post("http://localhost:5000/api/setMarkerInfo", {position}).then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error)
        });
        
        marker.addListener("click", ()=> {
          const position = marker.position;
          Axios.get("http://localhost:5000/api/getMarkerInfo").then((response) => {
            response.data.forEach((locationInfo) => {
              if(locationInfo.latitude == position.lat().toFixed(8) && locationInfo.longitude == position.lng().toFixed(8)) {
                console.log(locationInfo)
              }
            })
          }).catch((error) => {
            console.log(error)
          });
        })
      }}
        onPolygonComplete={(e) => {
          {
            for (let i = 0; i < e.getPath().getLength(); i++) {
              setMarkers((markers) => {
                const copy = [...markers];
                copy[i] = {
                  lat: e.getPath().getAt(i).lat(),
                  lng: e.getPath().getAt(i).lng(),
                };
                return copy;
              });
            }
          }
          setMarkerLoc({
            lat: e.getPath().getArray()[0].lat(),
            lng: e.getPath().getArray()[0].lng(),
          });
        }}
      />

      {markers.map((marker, index) => (
        <Marker key={index} position={marker}></Marker>
      ))}

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
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
