import React from "react";
import { useForm } from "react-hook-form";
import { Button, Container, Form, Row, Col, FloatingLabel } from "react-bootstrap";

export const LatLngUI = () => {
  return (
    <div className="lat-lng-ui">
      <Container>
        <Row className="w-100">
          <Col xs={6}>
            <div className="ms-2">
              <FloatingLabel label="Enter Latitude">
                <Form.Control type="text" placeholder="Enter Latitude" style={{height: "50px"}} />
              </FloatingLabel>
            </div>
          </Col>
          <Col xs={6}>
            <div className="ms-2">
              <FloatingLabel label="Enter Longitude">
                <Form.Control type="text" placeholder="Enter Longitude" style={{height: "50px"}}/>
              </FloatingLabel>
            </div>
          </Col>
        </Row>
        <Row className="w-100 mt-2">
            <Col xs={12} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div className="ms-2">
                    <Button>
                        Go to Location
                    </Button>
                </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
};