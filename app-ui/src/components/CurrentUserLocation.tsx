import React from 'react';
import Button from 'react-bootstrap/Button';

type center = google.maps.LatLng | google.maps.LatLngLiteral;

type CurrentUserLocationProps = {
    lat: number | (() => number);
    lng: number | (() => number);
    setCenter: React.Dispatch<React.SetStateAction<center>>;
}

const CurrentUserLocation = ({ lat, lng, setCenter }: CurrentUserLocationProps) => {
  return (
    <div className="vertical-widget-holder">
      <div id="mylocation" className="vertical-item">
        <Button 
          id="mylocation-button" 
          className="vertical-button"
          onClick={() => {
              setCenter({ lat, lng } as center);
          }}
          >
          <div className="vertical-button-icon">
            <img src="icon_images/user_location.png"/>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default CurrentUserLocation;