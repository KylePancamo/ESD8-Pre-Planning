import React from 'react';
import GenericPopupWindow from '../Popup/GenericPopup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

function AddLocation(props) {
    return (
        <GenericPopupWindow
            show={true}
            contentClassName="add-location-modal"
        >
            <Form className="location-form">
                <Form.Group className="occupancy-group">
                    <Container>
                        <Row className="row">
                            <Col>
                                <Form.Label style={{fontWeight: "bold"}}>Occupancy Information</Form.Label>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control type="text" placeholder="Occupancy Name"/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Occupancy Type"/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Contact Name"/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Emergency Contact"/>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
                <Form.Group className="address-group">
                    <Container>
                        <Row className="row">
                            <Form.Label>Address</Form.Label>
                        </Row>
                        <Row className="row">
                            <Col>
                                
                                <Form.Control type="text" placeholder="Street Address" />
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control style={{width: "100%"}} type="text" placeholder="City" />
                                
                            </Col>
                            <Col>
                                <Form.Control style={{width: "100%"}} type="text" placeholder="State" />
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control style={{width: "100%"}} type="text" placeholder="Postal / Zip Code" />
                                
                            </Col>
                            <Col>
                                <Form.Control style={{width: "100%"}} type="text" placeholder="Country" defaultValue="USA"/>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
                <Form.Group className="mutual-aid-group">
                    <Container>
                        <Row className="row">
                            <Form.Label>Mutual Aid Information</Form.Label>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control type="text" placeholder="Mutual Aid"/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Mutual Aid"/>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control type="text" placeholder="Mutual Aid"/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Mutual Aid"/>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
                <Form.Group className="occupancy-specific-group">
                    <Container>
                        <Row className="row">
                            <Form.Label>Occupancy Specific Information</Form.Label>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control as="textarea" rows={3} type="text" placeholder="Hazards"/>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control type="text" placeholder="Hydrant Address"/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Hydrant Distance (feet)"/>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control as="textarea" rows={3} type="text" placeholder="Access Information"/>
                            </Col>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control as="textarea" type="text" placeholder="Electic Meter Location"/>
                            </Col>
                            <Col>
                                <Form.Control as="textarea" type="text" placeholder="Breaker Box Location"/>
                            </Col>
                            <Col>
                                <Form.Control as="textarea" rows={2} type="text" placeholder="Water Location"/>
                            </Col>
                            <Col>
                                <Form.Control as="textarea" rows={2} type="text" placeholder="Gas Shutoff Location"/>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
                <Form.Group className="misc-notes-group">
                    <Container>
                        <Row className="row">
                            <Form.Label>Miscellaneous Notes</Form.Label>
                        </Row>
                        <Row className="row">
                            <Col>
                                <Form.Control as="textarea" rows={3} type="text" placeholder="Notes"/>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Form>

        </GenericPopupWindow>
    );
}

export default AddLocation;