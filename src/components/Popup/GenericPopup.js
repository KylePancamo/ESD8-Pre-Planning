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
      contentClassName={props.contentClassName}
    >
      <Modal.Header 
        closeButton 
        className={props.headerClassName}
      >
        <Modal.Title id="contained-modal-title-vcenter" className="m-2">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={props.bodyClassName}
      >
        {props.children}
      </Modal.Body>
      <Modal.Footer
        className={props.footerClassName}
      >
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GenericPopupWindow;
