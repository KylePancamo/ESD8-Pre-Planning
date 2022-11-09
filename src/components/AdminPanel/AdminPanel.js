import { useState, useEffect } from "react";
import Axios from "axios";
import FileUploads from "../Popup/FileUploads";
import GenericPopupWindow from "../Popup/GenericPopup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LocationsModal(props) {
  const [edit, setEdit] = useState(false);
  const [selectedEditLocation, setSelectedEditLocation] = useState();
  const [prePlanningLocations, setPrePlanningLocations] = useState([]);

  const fetchPreplanningLocations = () => {
    Axios.get("http://localhost:5000/api/getPreplanningLocations")
      .then((response) => {
        setPrePlanningLocations(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <GenericPopupWindow
        show={props.locationsButton}
        onHide={() => {
          props.setLocationsButton(false);
        }}
        title="Locations"
        contentClassName="locations-modal"
        onEntering={() => {
          fetchPreplanningLocations();
        }}
      >
        <div className="locations-modal-container">
          <Button variant="success" className="locations-modal-button-add">
            Add Location
          </Button>
        </div>
        {prePlanningLocations.map((location) => {
          return (
            <div className="location" key={location.id}>
              <table className="tables">
                <thead>
                  <tr className="thead-tr">
                    <th>Occupancy Id</th>
                    <th>Occupancy Name</th>
                  </tr>
                </thead>
                <tbody>
                  {prePlanningLocations.map((location) => {
                    return (
                      <tr key={location.id}>
                        <td>{location.id}</td>
                        <td>{location.occupancyname}</td>
                        <td>
                          <Button
                            variant="info"
                            style={{
                              marginLeft: "10px",
                              width: "fit-content",
                              height: "fit-content",
                              color: "white",
                            }}
                            onClick={() => {
                              setEdit(true);
                              setSelectedEditLocation(location);
                            }}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </GenericPopupWindow>
      <GenericPopupWindow
        show={edit}
        onHide={() => {
          setEdit(false);
        }}
        title="Edit Location"
      >
        <div className="editable-content">
          <Form>
            <Form.Group size="lg" controlId="email">
              <Form.Label>Occupancy Type :</Form.Label>

              <Form.Control
                autoFocus
                className="edit-form"
                defaultValue={
                  selectedEditLocation ? selectedEditLocation.occupancyname : ""
                }
              />
            </Form.Group>

            <Form.Group size="lg" controlId="password">
              <Form.Label>Construction Type :</Form.Label>

              <Form.Control
                className="edit-form"
                defaultValue={
                  selectedEditLocation
                    ? selectedEditLocation.constructiontype
                    : ""
                }
              />
              <div styles="height:20px"></div>
            </Form.Group>
            <Form.Group size="lg" controlId="email">
              <Form.Label>Mutual Aid:</Form.Label>

              <Form.Control autoFocus className="edit-form" />
            </Form.Group>

            <Form.Group size="lg" controlId="password">
              <Form.Label>Hazards:</Form.Label>

              <Form.Control
                className="edit-form"
                defaultValue={
                  selectedEditLocation ? selectedEditLocation.hazards : ""
                }
              />
              <div styles="height:20px"></div>
            </Form.Group>

            <Form.Group size="lg" controlId="password">
              <Form.Label>Hydrant Location:</Form.Label>

              {/*form control with <br/> in defaultValue*/}

              <Form.Control
                className="edit-form"
                defaultValue={
                  selectedEditLocation
                    ? selectedEditLocation.hydrant_address + " at " +
                      selectedEditLocation.hydrant_distance +
                      "ft from the building"
                    : ""
                }
              />
              <div styles="height:20px"></div>
            </Form.Group>

            <Form.Group size="lg" controlId="password">
              <Form.Label>Access:</Form.Label>

              <Form.Control className="edit-form" />
              <div styles="height:20px"></div>
            </Form.Group>

            <Form.Group size="lg" controlId="password">
              <Form.Label>Emergency Contact:</Form.Label>

              <Form.Control
                className="edit-form"
                defaultValue={
                  selectedEditLocation
                    ? selectedEditLocation.emergency_contact_number
                    : ""
                }
              />
              <div styles="height:20px"></div>
            </Form.Group>

            <Form.Group size="lg" controlId="password">
              <Form.Label>Notes :</Form.Label>

              <Form.Control
                className="edit-form"
                defaultValue={
                  selectedEditLocation ? selectedEditLocation.other_notes : ""
                }
              />
              <div styles="height:20px"></div>
            </Form.Group>
          </Form>
        </div>
      </GenericPopupWindow>
    </div>
  );
}
function AdminPanel(props) {
  const [fileUploadPopup, setFileUploadPopup] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [mainContentString, setMainContentString] = useState("");
  const [images, setImages] = useState([]);
  const [locationsButton, setLocationsButton] = useState(false);

  const fetchImages = () => {
    Axios.get("http://localhost:5000/api/getIcons")
      .then((response) => {
        setImages(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="admin-ui">
      <button
        className="btn btn-primary"
        onClick={() => {
          setAdminPanel(true);
          fetchImages();
        }}
      >
        Admin Panel
      </button>
      <GenericPopupWindow
        show={adminPanel}
        onHide={() => {
          setAdminPanel(false);
        }}
        title="Admin Panel"
        contentClassName="modal-admin"
      >
        <div className="admin-panel">
          <div className="admin-panel-leftbar">
            <Button
              variant="danger"
              onClick={() => {
                props.flushMarkers();
              }}
            >
              FlushMarkers
            </Button>
            <Button
              onClick={() => {
                setFileUploadPopup(true);
              }}
            >
              Upload File
            </Button>
            <FileUploads
              show={fileUploadPopup}
              onHide={() => {
                setFileUploadPopup(false);
              }}
              setImages={setImages}
            />
            <Button
              onClick={() => {
                setLocationsButton(true);
              }}
            >
              View Locations
            </Button>
            <LocationsModal
              show={locationsButton}
              setLocationsButton={setLocationsButton}
              locationsButton={locationsButton}
            />
          </div>
          <div className="admin-panel-main">
            <h2>List of Images:</h2>
            <div className="list-image-container">
              <table className="tables">
                <thead>
                  <tr className="tr">
                    <th>Image Id</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => {
                    return (
                      <tr className="image-body" key={image.icon_id}>
                        <td>{image.icon_id}</td>
                        <td>
                          <img
                            src={"/images/" + image.file_name}
                            alt={image.name}
                            className="images"
                          />
                        </td>
                        <td>
                          <Button>Delete</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </GenericPopupWindow>
    </div>
  );
}

export default AdminPanel;
