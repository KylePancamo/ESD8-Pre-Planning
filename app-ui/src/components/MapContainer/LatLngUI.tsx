import React from "react";
import { useForm } from "react-hook-form";
import { Button, Container, Form, Row, Col, FloatingLabel } from "react-bootstrap";

type center = google.maps.LatLng | google.maps.LatLngLiteral;
type LatLngUIProps = {
  setCenter: React.Dispatch<React.SetStateAction<center>>;
};

export const LatLngUI = ({setCenter} : LatLngUIProps) => {
  const [latitude, setLatitude] = React.useState<number>(0);
  const [longitude, setLongitude] = React.useState<number>(0);


  return (
    <div className="lat-lng-ui">
      <Container>
        <Row className="w-100">
          <Col xs={6}>
            <div className="ms-2">
              <FloatingLabel label="Enter Latitude">
                <Form.Control 
                  type="number" 
                  placeholder="Enter Latitude" 
                  style={{height: "50px"}}
                  onChange={(e) => {
                    setLatitude(Number(e.target.value));
                  }}
                />
              </FloatingLabel>
            </div>
          </Col>
          <Col xs={6}>
            <div className="ms-2">
              <FloatingLabel label="Enter Longitude">
                <Form.Control 
                  type="number"
                  placeholder="Enter Longitude"
                  style={{height: "50px"}}
                  onChange={(e) => {
                    setLongitude(Number(e.target.value));
                  }}
                />
              </FloatingLabel>
            </div>
          </Col>
        </Row>
        <Row className="w-100 mt-2">
            <Col xs={12} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className="ms-2">
                    <Button
                      onClick={() => {
                        setCenter({lat: latitude, lng: longitude});
                      }}
                    >
                        Go to Location
                    </Button>
                </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
};