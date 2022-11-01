import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Axios from "axios";
import { Pencil } from "react-bootstrap-icons";
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

  useEffect(() => {
    Axios.get("http://localhost:5000/api/getIcons")
      .then((response) => {
        setImageIcons(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleMarkerSaving = () => {
    let markerFound = props.markers.find(
      (marker) => marker.marker_id === props.selectedMarker.marker_id
    );

    if (markerFound) {
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
          }));
          // update props.markers array with new icon
          props.setMarkers((markers) => {
            return markers.map((marker) => {
              if (marker.marker_id === props.selectedMarker.marker_id) {
                marker.file_name = selectedIcon.icon_name;
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
  }

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
      onExit={() => {
        setSelectedIcon({ icon_id: 0, icon_name: "" });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="m-2">
          Marker Modification
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Form>
                <Form.Group controlId="formBasicText">
                  <Form.Label>Current Marker Name: <b>{props.selectedMarker.marker_name}</b></Form.Label>
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
            <Col xs={6} md={4}>
              <b>Current Marker Icon: </b>
              <img
                src={"/images/" + props.selectedMarker.file_name}
                alt={""}
                className="images"
              />
            </Col>
            <Col xs={6} md={4}>
              <Col xs={6} md={2}>
                <DropdownButton
                  id="dropdown-basic-button"
                  title="Select an icon"
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
                {selectedIcon.icon_name !== "" ? (
                  <img
                    src={"/images/" + selectedIcon.icon_name}
                    alt={""}
                    className="images"
                  />
                ) : null}
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs={6} lg={8}>
              <b>Marker Location: </b>
              {props.selectedMarker.latitude},{props.selectedMarker.longitude}
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
          Are you sure you want to delete this marker? This action cannot be  undone.
        </Alert>
      </GenericPopupWindow>
    </Modal>
  );
}

export default PopupWindow;
