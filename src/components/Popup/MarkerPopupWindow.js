import MarkerDeletion from './MarkerDeletion';
import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Axios from "axios";

import {useForm} from 'react-hook-form';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {useAuth} from "../../hooks/AuthProvider";
import {permission} from "../../permissions";

function PopupWindow(props) {
  let inputRef = useRef(null);
  const [imageIcons, setImageIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState({
    icon_id: 0,
    icon_name: "",
  });
  const {userData} = useAuth();

  const [markerSaved, setMarkerSaved] = useState(false);
  const [markerDeleted, setMarkerDeleted] = useState(false);
  const [markerName, setMarkerName] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchImages = () => {
    Axios.get("http://localhost:5000/api/get-uploaded-icons")
      .then((response) => {
        setImageIcons(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setSelectedIcon({
      icon_id: props.selectedMarker.icon_id,
      icon_name: props.selectedMarker.file_name,
    });
  }, [props]);

  const handleMarkerSaving = (inputData) => {
    inputData.imageName = selectedFile?.name;
    let markerFoundOnMap = props.markers.find(
      (marker) => marker.marker_id === props.selectedMarker.marker_id
    );

    if (markerFoundOnMap)  {
      const formData = new FormData();
      formData.append("file", inputRef.current?.files[0] ? inputRef.current?.files[0] : null);
      formData.append("marker_id", inputData.selectedMarkerId);
      formData.append("icon_id", selectedIcon.icon_id);
      formData.append("marker_name", inputData.markerName);
      formData.append("latitude", inputData.latitude);
      formData.append("longitude", inputData.longitude);
      formData.append("image_name", inputRef.current?.files[0] ? inputRef.current?.files[0].name : props.selectedMarker.image);
      
      Axios.post("http://localhost:5000/api/update-map-marker", formData, {
        withCredentials: true,
      })
        .then((response) => {
          console.log(response);
          props.setSelectedMarker({
            ...props.selectedMarker,
            file_name: selectedIcon.icon_name,
            marker_name: inputData.markerName,
            latitude: inputData.latitude,
            longitude: inputData.longitude,
            image: inputRef.current?.files[0] ? inputRef.current?.files[0].name : props.selectedMarker.image,
          })
          props.setMarkers((markers) => {
            let newMarkers = markers.map((marker) => {
              if (marker.marker_id === props.selectedMarker.marker_id) {
                marker.file_name = selectedIcon.icon_name;
                marker.marker_name = inputData.markerName;
                marker.latitude = inputData.latitude;
                marker.longitude = inputData.longitude;
                marker.icon_id = selectedIcon.icon_id;
                marker.image = inputRef.current?.files[0] ? inputRef.current?.files[0].name : props.selectedMarker.image;
              }
              return marker;
            });
            localStorage.setItem("markers", JSON.stringify(newMarkers));
            return newMarkers;
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
  
  //used for file preview
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState();

  const handleFileUpload = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  useEffect(() => {
    resetFormData();
  }, [props.selectedMarker]);

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

  const resetFormData = () => {
    //console.log(props.selectedMarker);
    reset({
      markerName: props.selectedMarker.marker_name,
      latitude: props.selectedMarker.latitude,
      longitude: props.selectedMarker.longitude,
      activeIcon: props.selectedMarker.file_name,
      activeIconId: props.selectedMarker.icon_id,
      selectedMarkerId: props.selectedMarker.marker_id,
      image_name: props.selectedMarker.image,
    })
  }

  const onSelectFile = e => {
    if (!inputRef.current?.files || inputRef.current?.files.length === 0) {
        setSelectedFile(undefined)
        return
    }
    
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
          <Form>
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
                  onChange={() => {
                    onSelectFile();
                  }}
                />
                <div className="marker-image">
                  {selectedFile ? (
                      <img style={{width: "30vw"}} src={preview} />
                    ) : (props.selectedMarker.image !== null && props.selectedMarker.image !== "") ? (
                      <img style={{width: "30vw"}} src={"/marker_images/" + props.selectedMarker.image} />
                    ) : <>No image present</>
                  }
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
                        src={"/icon_images/" + selectedIcon.icon_name}
                        alt={""}
                        style={{ width: "1.2vw"}}
                      />
                    }
                  >
                    {imageIcons.map((icon) => (
                      <Dropdown.Item
                        onClick={() => {
                          setValue("activeIcon", icon.file_name);
                          setValue("activeIconId", icon.icon_id);
                          setSelectedIcon({
                            icon_id: icon.icon_id,
                            icon_name: icon.file_name,
                          });
                        }}
                        key={icon.icon_id}
                      >
                        {
                          <img
                            src={"/icon_images/" + icon.file_name}
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
                  <Form.Group>
                    <Form.Label>
                      Current Marker Name:
                      <b>{props.selectedMarker.marker_name}</b>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter New Marker Name"
                      {...register("markerName", {
                        required: true
                      })}
                    >
                    </Form.Control>
                  </Form.Group>
              </Col>
              <Col>
                  <Form.Group>
                    <Form.Label>
                      Latitude
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter new latitude"
                      {...register("latitude", {required: true})}
                    />
                  </Form.Group>
              </Col>
              <Col>
                  <Form.Group>
                    <Form.Label>
                      Longitude
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter new longitude"
                      {...register("longitude", {required: true})}
                    />
                  </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {(userData.permissions & permission.DELETE) !== 0 ? (
        <Button
          onClick={deleteMarkerPopup}
          variant={"danger"}
          className="delele-marker"
        >
          Delete Marker
        </Button>
        ) : null}
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={handleSubmit((data) => handleMarkerSaving(data))}>Save</Button>
      </Modal.Footer>
      <MarkerDeletion
        markerSaved={markerSaved} 
        setMarkerSaved={setMarkerSaved} 
        markerDeleted={markerDeleted} 
        setMarkerDeleted={setMarkerDeleted}
        props={props}
      />
    </Modal>
  );
}

export default PopupWindow;