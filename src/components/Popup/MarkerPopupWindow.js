import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

function PopupWindow(props) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="m-2">Test</Modal.Title>
        <Row className="ms-4">
          <Col xs={12} md={8}>
          🎁
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={12} md={4}>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label>Marrker Icon URL</Form.Label>
                  <Form.Control type="email" placeholder="Enter URL" />
                </Form.Group>
              </Form>
            </Col>
            <Col xs={6} lg={8}>
              <b>Marker Location: </b>
              {props.markerLoc.latitude},{props.markerLoc.longitude}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={props.onHide}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PopupWindow;
