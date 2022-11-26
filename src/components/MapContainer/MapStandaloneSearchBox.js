import React from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import Form from "react-bootstrap/Form";
function MapStandaloneSearchBox({
  bounds,
  onPlacesChanged,
  onSBLoad
}) {
  return <StandaloneSearchBox bounds={bounds} onPlacesChanged={onPlacesChanged} onLoad={onSBLoad}>
        <Form.Control type="text" placeholder="Search for a location" style={{
      boxSizing: `border-box`,
      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
      textOverflow: `ellipses`,
      position: `absolute`,
      left: `40vw`,
      top: `5%`,
      width: `18vw`
    }} />
      </StandaloneSearchBox>;
}
  
export default MapStandaloneSearchBox;