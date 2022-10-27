import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function FileUpload(props) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = () => {
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = () => {
   if (inputRef.current?.files.length > 0) {
      setFileName(inputRef.current?.files[0].name);
    }
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="m-2">
          File Upload
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label className="mx-3">Choose File: </label>
          <input id="input-file" className="d-none" type="file" ref={inputRef} onChange={handleDisplayFileDetails}/>
          <button onClick={handleFileUpload} 
          className={`btn btn-outline-${
            fileName ? "success" : "primary"
          }`}>
            {fileName ? fileName : "Upload"}
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FileUpload;
