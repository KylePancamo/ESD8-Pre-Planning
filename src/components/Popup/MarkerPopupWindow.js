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

function EditWindow(props) {
  return (
    <GenericPopupWindow
      show={props.edit}
      onHide={() => props.setEdit(false)}
      size="sm"
    >
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Marker Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Marker Name" />
          <Form.Text className="text-muted">
            This is the name of the marker.
          </Form.Text>
        </Form.Group>
      </Form>
    </GenericPopupWindow>
  );
}

function PopupWindow(props) {
  const [imageIcons, setImageIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState({
    icon_id: 0,
    icon_name: "",
  });
  const [edit, setEdit] = useState(false);
  const [markerSaved, setMarkerSaved] = useState(false);
  const [currentMarker, setCurrentMarker] = useState();

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
      (marker) => marker.marker_id === props.marker.marker_id
    );
    if (markerFound) {
      const data = {
        marker_id: props.marker.marker_id,
        icon_id: selectedIcon.icon_id,
      };
      Axios.post("http://localhost:5000/api/updateMarker", { data })
        .then((response) => {
          props.setMarker((prevMarker) => ({
            ...prevMarker,
            file_name: selectedIcon.icon_name,
          }));
          // update props.markers array with new icon
          props.setMarkers((markers) => {
            return markers.map((marker) => {
              if (marker.marker_id === props.marker.marker_id) {
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
    } else {
      const data = {
        marker_id: props.marker.marker_id,
        icon_id: selectedIcon.icon_id,
      };
      Axios.post("http://localhost:5000/api/updateMarker", { data })
        .then((response) => {
          // add drawmanager marker to props.markers array
          props.setMarkers((current) => [
            ...current,
            {
              marker_id: props.marker.marker_id,
              marker_name: props.marker.marker_name,
              latitude: props.marker.latitude,
              longitude: props.marker.longitude,
              file_name: selectedIcon.icon_name,
            },
          ]);
          props.setMarker((prevMarker) => ({
            ...prevMarker,
            file_name: selectedIcon.icon_name,
          }));
          // remove drawManager marker from the map
          props.drawManagerMarker.setMap(null);
        })
        .then(() => {
          setMarkerSaved(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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
        <Button
          size="sm"
          onClick={() => {
            setEdit(true);
          }}
        >
          <div className="edit-menu-button">
            <Pencil />
            Edit
          </div>
        </Button>
        {
          <EditWindow
            edit={edit}
            setEdit={() => {
              setEdit(false);
            }}
          />
        }
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={6} md={4}>
              Marker Name: {props.marker.marker_name}
            </Col>
            <Col xs={6} md={4}>
              <b>Current Marker Icon: </b>
              <img
                src={"/images/" + props.marker.file_name}
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
              {props.marker.latitude},{props.marker.longitude}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
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
    </Modal>
  );
}

export default PopupWindow;
