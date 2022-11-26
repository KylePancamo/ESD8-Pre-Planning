import EditLocation from "./EditLocation";
import AddLocation from "./AddLocation";
import {useState} from 'react';
import Axios from "axios";
import GenericPopupWindow from "../Popup/GenericPopup";
import Button from "react-bootstrap/Button";

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
  };

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
          <Button
            variant="success"
            className="locations-modal-button-add"
            onClick={() => setAddLocationTrigger(true)}
          >
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
                          setCurrentEditLocation({
                            id: location.id,
                          });
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

export default LocationsModal;
