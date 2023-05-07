import React from 'react';
import Button from 'react-bootstrap/Button';
import { GrUpdate } from 'react-icons/gr';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type center = google.maps.LatLng | google.maps.LatLngLiteral;

type CurrentUserLocationProps = {
    lat: number | (() => number);
    lng: number | (() => number);
    setCenter: React.Dispatch<React.SetStateAction<center>>;
}

type CurrentOccupancyLocation = {
  map: google.maps.Map | null | undefined;
  occupancyLocation: center;
}

type UpdateCurrentLocationProps = {
  updateUserLocation: () => void;
}

export const CurrentUserLocation = ({ lat, lng, setCenter }: CurrentUserLocationProps) => {
  return (
    <div id="mylocation" className="vertical-item">
      <OverlayTrigger
        placement={"left"}
        overlay={
          <Tooltip>
            Go to user location
          </Tooltip>
        }
      >
        <Button 
          className="vertical-button"
          onClick={() => {
              setCenter({ lat, lng } as center);
          }}
          variant="light"
        >
          <div className="vertical-button-icon">
            <img src="/user_location.png"/>
          </div>
      </Button>
      </OverlayTrigger>
    </div>
  );
};

export const CurrentOccupancyLocation = ({map, occupancyLocation}: CurrentOccupancyLocation) => {
  return (
    <div className="vertical-item">
      <OverlayTrigger
        placement={"left"}
        overlay={
          <Tooltip>
            Go to occupancy Location
          </Tooltip>
        }
      >
        <Button
          onClick={() => {
            map?.panTo(occupancyLocation as google.maps.LatLng | google.maps.LatLngLiteral);
            map?.setZoom(15);
          }}
          className="vertical-button"
          variant="light"
        >
          <div className="vertical-button-icon">
            <img 
              src="/map-pin.png"
              style={{
                width: "25px",
              }}
            />
          </div>
        </Button>
      </OverlayTrigger>
    </div>
  );
}

export const UpdateUserLocation = React.memo(({updateUserLocation}: UpdateCurrentLocationProps) => {
  return (
    <div className="vertical-item">
      <OverlayTrigger
        placement={"left"}
        overlay={
          <Tooltip>
            Refresh user location
          </Tooltip>
        }
      >
        <Button
          onClick={updateUserLocation}
          className="vertical-button"
          variant="light"
        >
          <div className="vertical-button-icon">
            <GrUpdate size={12}/>
          </div>
        </Button>
      </OverlayTrigger>
    </div>
  );
});
