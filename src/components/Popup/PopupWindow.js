import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function PopupWindow(props) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.markerLoc.marker_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Marker Id: </h4>
        <p>
            Marker Location:
            <br />
            {props.markerLoc.latitude}
            <br />
            {props.markerLoc.longitude}

        </p>
        <p>
            Marker Icon: 🎁
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PopupWindow;
