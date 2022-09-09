import React, { useState }from 'react'
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from '@react-google-maps/api';
import style from './style';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 29.5831,
  lng: -98.6197
};

const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15
  }

function MyComponent() {
  const [activeMarker, setActiveMarker] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleOnClick = () => {
    console.log(activeMarker)
    setActiveMarker(true)
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => setActiveMarker(false)}
      >
        <Marker
            position={center}
            onClick={ () => handleOnClick() }
        >            

        {activeMarker === true ? (
            <InfoWindow onCloseClick={() => setActiveMarker(false)}>
                <div style={divStyle}>
                    <h1>Info Window</h1>
                </div>
            </InfoWindow>
            ) : null }
        </Marker>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)