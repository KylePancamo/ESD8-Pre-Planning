import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function GenericPopupWindow(props) {
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
        <Modal.Title id="contained-modal-title-vcenter" className="m-2">Generic Popup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={props.onHide}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GenericPopupWindow;
