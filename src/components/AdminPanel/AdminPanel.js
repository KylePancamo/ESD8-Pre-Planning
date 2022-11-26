import { useState } from "react";
import FileUploads from "../Popup/FileUploads";
import GenericPopupWindow from "../Popup/GenericPopup";
import Button from "react-bootstrap/Button";
import IconEditWindow from "./IconEditWindow";
import {useRecoilState} from 'recoil';
import {imagesState} from "../../atoms";
import LocationsModal from './LocationsModal';

function AdminPanel(props) {
  const [fileUploadPopup, setFileUploadPopup] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [mainContentString, setMainContentString] = useState("");
  const [images, setImages] = useRecoilState(imagesState);
  const [locationsButton, setLocationsButton] = useState(false);
  const [iconEditState, setIconEditState] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState();

  return (
    <div className="admin-ui">
      <button
        className="btn btn-primary"
        onClick={() => {
          setAdminPanel(true);
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
                            src={"/icon_images/" + image.file_name}
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