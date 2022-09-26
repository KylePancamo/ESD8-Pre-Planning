import React, { useState }from 'react'
import { GoogleMap, useJsApiLoader, InfoWindow, Marker, DrawingManager, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 29.615106009353045,
  lng: -98.68537740890328
};

const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15
  }

function MyComponent() {
  const [activeMarker, setActiveMarker] = useState(false);
  const [markerLoc, setMarkerLoc] = useState({lat: 29.715106009353045, lng: -98.78537740890328});
  const [markers, setMarkers] = useState([{lat: 0, lng: 0},{lat: 0, lng: 0},{lat: 0, lng: 0}]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['drawing'],
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

  const onPlacesChanged = () => console.log(this.searchBox.getPlaces());

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => {
          setActiveMarker(false)
        }}
      >
        <Marker
            position={center}
            onClick={ () => handleOnClick()}
            draggable={true}
            label={window.google.maps.MarkerLabel = {
                text: "ESD8",
                fontSize: "12px",
                
            }}
        >
          <StandaloneSearchBox>
            <input 
              type="text"
              placeholder="Search for a location"
              ref={ref => this.searchBox = ref}
              onChange={onPlacesChanged}
              />
          </StandaloneSearchBox>

        {activeMarker === true ? (
            <InfoWindow 
              onCloseClick={() => setActiveMarker(false)}>
                <div style={divStyle}>
                    <h1> Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                      Nam convallis pretium fermentum. Cras sagittis, libero quis maximus sagittis, magna velit pulvinar tellus, a tincidunt magna tellus a est. 
                      Aliquam pretium eros lectus. Nunc elit lorem, imperdiet malesuada iaculis vel, pellentesque non enim. In lobortis nibh at libero vulputate, 
                      laoreet ullamcorper arcu elementum. Morbi faucibus vel urna nec iaculis. Donec sit amet tempus lectus. Nunc pulvinar ex quis interdum elementum.</h1>
                </div>
            </InfoWindow>
            ) : null }
        </Marker>
        <DrawingManager
            drawingMode={window.google.maps.drawing.OverlayType.POLYGON}
            onPolygonComplete={(e) => {
              {
                for (let i = 0; i < e.getPath().getLength(); i++) {
                  setMarkers(markers => {
                    const copy = [...markers];
                    copy[i] = {lat: e.getPath().getAt(i).lat(), lng: e.getPath().getAt(i).lng()};
                    return copy;
                  }
                  );
                }
              }
              setMarkerLoc({lat: e.getPath().getArray()[0].lat(), lng: e.getPath().getArray()[0].lng()})
            }
          }
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker}
          >
          </Marker>
        ))}
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)