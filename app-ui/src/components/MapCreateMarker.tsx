import React, { useEffect, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { marker } from "../types/marker-types";
import { useRecoilState } from "recoil";
import { defaultMarkerIconExistsState } from "../atoms";
import Axios from "axios";
import config from "../config/config";
import GenericPopupWindow from "./Popup/GenericPopup";

type CreateMarkerProps = {
    setIsCreateMarkerUIVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setMarkers: React.Dispatch<React.SetStateAction<marker[]>>;
    markers: marker[];
}

const MapCreateMarker = ({setIsCreateMarkerUIVisible, setMarkers, markers} : CreateMarkerProps) => {
    const [latitude, setLatitude] = React.useState(0);
    const [longitude, setLongitude] = React.useState(0);
    const [defaultMarkerIconExists, SetDefaultMarkerIconExists] = useRecoilState(defaultMarkerIconExistsState);

    const handleMarkerCreation = () => {
        if (defaultMarkerIconExists) {
            const payload = {
                position: {
                    lat: latitude,
                    lng: longitude,
                },
                fileName: config.DEFAULT_MARKER_NAME,
                fileExists: defaultMarkerIconExists,
            }

            Axios.post(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/insert-placed-marker", {
                payload,
            }, {
              withCredentials: true,
            })
              .then((response) => {
                console.log(response.data.payload);
                if (markers) {
                  setMarkers((markers) => {
                    let newMarkers = [
                      ...markers,
                      {
                        marker_id: response.data.payload.marker_id,
                        marker_name: response.data.payload.marker_name,
                        latitude: parseFloat(response.data.payload.latitude),
                        longitude: parseFloat(response.data.payload.longitude),
                        icon_id: response.data.payload.icon_id,
                        image: null,
                        file_name: defaultMarkerIconExists ? config.DEFAULT_MARKER_NAME : "",
                        position: {
                          lat: Number(response.data.payload.latitude),
                          lng: Number(response.data.payload.longitude),
                        },
                      }
                    ]
                    localStorage.setItem("markers", JSON.stringify(newMarkers));
                    return newMarkers;
                  });
                } else {
                  setMarkers(() => {
                    let newMarker = [{
                      marker_id: response.data.payload.marker_id,
                      marker_name: response.data.payload.marker_name,
                      latitude: parseFloat(response.data.payload.latitude),
                      longitude: parseFloat(response.data.payload.longitude),
                      icon_id: response.data.payload.icon_id,
                      image: null,
                      file_name: defaultMarkerIconExists ? config.DEFAULT_MARKER_NAME : "",
                      position: {
                        lat: Number(response.data.payload.latitude),
                        lng: Number(response.data.payload.longitude),
                      },
                    }]
                    localStorage.setItem("markers", JSON.stringify(newMarker));
                    return newMarker;
                })
                }
              }).catch((error) => {
                console.log(error);
              });
        }
    }

    return (
        <div className="create-marker">
            <Button
                className="create-marker-close-button d-inline-flex"
                onClick={() => setIsCreateMarkerUIVisible(false)}
            >X</Button>
            <Form className="create-marker-form">
                <Container>
                    <Row className="form-row" md={12}>
                        <Col className="form-column" md={6}>
                            <Form.Group className="form-item">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    type="text" 
                                    placeholder="Enter latitude"
                                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col className="form-column" md={6}>
                            <Form.Group className="form-item">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control 
                                    type="text"
                                    placeholder="Enter longitude"
                                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="form-row" md={12}>
                        <Col className="form-column" md={6}>
                            <Form.Group id="create-marker" className="form-item">
                                <Button onClick={handleMarkerCreation}>Create Marker</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </div>
    );
}

export default MapCreateMarker;