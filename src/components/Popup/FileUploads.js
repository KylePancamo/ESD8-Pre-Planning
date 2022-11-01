import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Axios from "axios";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

function FileUpload(props) {
  let inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [FileUploadStatus, setFileUploadStatus] = useState();
  const [FileUploadString, setFileUploadString] = useState("");

  const handleFileUpload = () => {
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = () => {
    if (inputRef.current?.files.length > 0) {
      // create formData object and append file data to it. Then make axios request to backend
      const formData = new FormData();
      formData.append("file", inputRef.current?.files[0]);
      Axios.post("http://localhost:5000/api/upload", formData)
        .then((response) => {
          setFileUploadStatus(true);
          setFileUploadString(response.data.message);
          setFileName(inputRef.current?.files[0].name);
          props.setImages(currImages => [...currImages, response.data.payload]);
        })
        .catch((error) => {
          console.log(error);
          setFileUploadStatus(false);
          setFileUploadString(error.response.data.message);
        });
    }
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onExit={() => {
          setFileUploadStatus(undefined);
          setFileUploadString("");
          setFileName("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="m-2">
            File Upload
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label className="mx-3">Choose File: </label>
            <input
              id="input-file"
              className="d-none"
              type="file"
              ref={inputRef}
              onChange={handleDisplayFileDetails}
            />
            <button
              onClick={handleFileUpload}
              className={`btn btn-outline-${fileName ? "success" : "danger"}`}
            >
              {fileName ? fileName : "Upload"}
            </button>
          </div>
          { FileUploadStatus === true ? (
            <Alert variant="success" className="m-2">
              {FileUploadString}
            </Alert>
          ) : null}

          { FileUploadStatus === false ? (
            <Alert variant="danger" className="m-2">
              {FileUploadString}
            </Alert>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FileUpload;