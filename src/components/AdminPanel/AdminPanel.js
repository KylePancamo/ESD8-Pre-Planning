import { useState, useEffect } from "react";
import Axios from "axios";
import FileUploads from "../Popup/FileUploads";
import GenericPopupWindow from "../Popup/GenericPopup";
import Button from "react-bootstrap/Button";
import AddLocation from "./AddLocation";
import EditLocation from "./EditLocation";
import IconEditWindow from "./IconEditWindow";

function LocationsModal(props) {
  const [edit, setEdit] = useState(false);
  const [selectedEditLocation, setSelectedEditLocation] = useState();
  const [prePlanningLocations, setPrePlanningLocations] = useState([]);
  const [addLocationTrigger, setAddLocationTrigger] = useState(false);
  const [currentEditLocation, setCurrentEditLocation] = useState({});

  const updateLocations = (newVal) => {
    setPrePlanningLocations((locations) => {
      return locations.map((location) => {
        if (location.id === newVal.id) {
          location.occupancyname = newVal.occupancyname;
          location.occupancyaddress = newVal.occupancyaddress;
        }
        return location;
      });
    });
  }

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
          <Button variant="success" className="locations-modal-button-add" onClick={() => setAddLocationTrigger(true)}>
            Add Location
          </Button>
          <AddLocation
            show={addLocationTrigger}
            onHide={() => setAddLocationTrigger(false)}
          />
        </div>
        <div className="location">
          <table className="tables">
            <thead>
              <tr className="tr">
                <th>Occupancy Id</th>
                <th>Occupancy Name</th>
                <th>Occupancy Address</th>
              </tr>
            </thead>
            <tbody>
              {prePlanningLocations.map((location) => {
                return (
                  <tr className="tr" key={location.id}>
                    <td>{location.id}</td>
                    <td>{location.occupancyname}</td>
                    <td>{location.occupancyaddress}</td>
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
                          setCurrentEditLocation({id: location.id});
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
      </GenericPopupWindow>
      <EditLocation 
        show={edit}
        onHide={() => setEdit(false)}
        selectedEditLocation={selectedEditLocation}
        updateLocations={updateLocations}
      />
    </div>
  );
}
function AdminPanel(props) {
  const [fileUploadPopup, setFileUploadPopup] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [mainContentString, setMainContentString] = useState("");
  const [images, setImages] = useState([]);
  const [locationsButton, setLocationsButton] = useState(false);
  const [iconEditState, setIconEditState] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState();


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
                    <th>Icon Name</th>
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
                          {image.icon_name}
                        </td>
                        <td>
                          <Button
                            onClick={() => {
                              setIconEditState(true);
                              setSelectedIcon(image);
                            }}
                          >Edit</Button>
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
      <IconEditWindow
        show={iconEditState}
        onHide={() => setIconEditState(false)}
        selectedIcon={selectedIcon}
        setSelectedIcon={setSelectedIcon}
        contentClassName="modal-edit-icon"
        setImages={setImages}
      />
    </div>
  );
}

export default AdminPanel;