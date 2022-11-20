import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Axios from "axios";
import GenericPopupWindow from "./GenericPopup";
import Alert from "react-bootstrap/Alert";


import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

function PopupWindow(props) {
  const [imageIcons, setImageIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState({
    icon_id: 0,
    icon_name: "",
  });
  const [edit, setEdit] = useState(false);
  const [markerSaved, setMarkerSaved] = useState(false);
  const [markerDeleted, setMarkerDeleted] = useState(false);
  const [currentMarker, setCurrentMarker] = useState();
  const [markerName, setMarkerName] = useState("");

  const fetchImages = () => {
    Axios.get("http://localhost:5000/api/getIcons")
      .then((response) => {
        setImageIcons(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setSelectedIcon({
      icon_id: 0,
      icon_name: props.selectedMarker.file_name,
    });
  }, [props]);

  const handleMarkerSaving = () => {
    let markerFound = props.markers.find(
      (marker) => marker.marker_id === props.selectedMarker.marker_id
    );

    if (markerFound)  {
      const data = {
        marker_id: props.selectedMarker.marker_id,
        icon_id: selectedIcon.icon_id,
        marker_name: markerName,
      };
      Axios.post("http://localhost:5000/api/updateMarker", { data })
        .then((response) => {
          props.setSelectedMarker((prevMarker) => ({
            ...prevMarker,
            file_name: selectedIcon.icon_name,
            marker_name: (markerName === "") ? prevMarker.marker_name : markerName,
          }));
          // update props.markers array with new icon
          props.setMarkers((markers) => {
            return markers.map((marker) => {
              if (marker.marker_id === props.selectedMarker.marker_id) {
                marker.file_name = selectedIcon.icon_name;
                marker.marker_name = (markerName === "") ? marker.marker_name : markerName;
              }
              return marker;
            });
          });
        })
        .then(() => {
          setMarkerSaved(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteMarkerPopup = () => {
    setMarkerDeleted(true);
  };

  const handleMarkerDelete = () => {
    const data = {
      marker_id: props.selectedMarker.marker_id,
    };
    Axios.delete("http://localhost:5000/api/deleteMarker", { data })
      .then((response) => {
        console.log(response);
        // remove marker from props.markers array
        props.setMarkers((markers) => {
          return markers.filter(
            (marker) => marker.marker_id !== props.selectedMarker.marker_id
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setMarkerDeleted(false);
    props.onHide();
  };

    // file upload
    let inputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState();
  
    const handleFileUpload = () => {
      inputRef.current?.click();
    };
  
    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
      if (!selectedFile) {
          setPreview(undefined)
          return
      }
  
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
  
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])
  
    const onSelectFile = e => {
      if (!inputRef.current?.files || inputRef.current?.files.length === 0) {
          setSelectedFile(undefined)
          return
      }
  
      // I've kept this example simple by using the first image instead of multiple
      setSelectedFile(inputRef.current?.files[0])
    }


  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      onEnter={() => {
        fetchImages();
      }}
      onExit={() => {
        setSelectedIcon({ icon_id: 0, icon_name: "" });
        setSelectedFile(undefined);
      }}
      contentClassName="marker-modification"
    >
      <Modal.Header closeButton>
        <div className="marker-location">
          <b>Marker Location: </b>
          <br/>
          {props.selectedMarker.latitude},{props.selectedMarker.longitude}
        </div>  
        <Modal.Title className="header-title">Edit this Marker</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="icon-modification">
            <Col style={{display: "flex", alignItems: "flex-start", gap: "2vh", flexDirection: "column"}}>
              <label style={{display: "flex", alignItems: "center", gap: ".2vw"}}>
                Select an photo image to display: 
                <Button 
                  onClick={handleFileUpload}
                  style={{ width: "fit-content" }}
                >
                  Select Image
                </Button>
              </label>
                
              <input
                id="input-file"
                className="d-none"
                type="file"
                ref={inputRef}
                onChange={onSelectFile}
              />
              <div className="marker-image">
                  {selectedFile ? (
                    <img style={{width: "30vw"}} src={preview} />
                  ) : null }
              </div>
            </Col>
          </Row>
          <Row className="icon-modification">
          <Col style={{display: "flex", alignItems: "center", gap: "2%"}}>
              <b>Edit Icon Image: </b>
              <Col>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={
                    <img
                      src={"/images/" + selectedIcon.icon_name}
                      alt={""}
                      style={{ width: "2vw"}}
                    />
                  }
                >
                  {imageIcons.map((icon) => (
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedIcon({
                          icon_id: icon.icon_id,
                          icon_name: icon.file_name,
                        });
                      }}
                      key={icon.icon_id}
                    >
                      {
                        <img
                          src={"/images/" + icon.file_name}
                          alt={icon.name}
                          className="images"
                        />
                      }
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Col>
              
            </Col>
          </Row>
          <Row className="icon-modification">
            <Col xs={6} md={4}>
              <Form>
                <Form.Group>
                  <Form.Label>
                    Current Marker Name:
                    <b>{props.selectedMarker.marker_name}</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter New Marker Name"
                    onChange={(e) => {
                      setMarkerName(e.target.value);
                    }}
                  >
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>
                    Latitude
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter new latitude"
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>
                    Longitude
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter new latitude"
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={deleteMarkerPopup}
          variant={"danger"}
          className="delele-marker"
        >
          Delete Marker
        </Button>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={handleMarkerSaving}>Save</Button>
      </Modal.Footer>
      <GenericPopupWindow
        show={markerSaved}
        onHide={() => setMarkerSaved(false)}
        title="Marker Saved"
      >
        <Alert variant="success">
          The marker icon was successfully changed. You can close this box
        </Alert>
      </GenericPopupWindow>
      <GenericPopupWindow
        show={markerDeleted}
        onHide={() => setMarkerDeleted(false)}
        title="Marker Deletion Warning"
        extraButton={"Delete Marker"}
        extraAction={handleMarkerDelete}
      >
        <Alert variant="danger">
          Are you sure you want to delete this marker? This action cannot be
          undone.
        </Alert>
      </GenericPopupWindow>
    </Modal>
  );
}

export default PopupWindow;
