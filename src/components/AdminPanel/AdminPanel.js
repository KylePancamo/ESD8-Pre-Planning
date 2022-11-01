import { useState, useEffect } from "react";
import Axios from "axios";
import FileUploads from "../Popup/FileUploads";
import GenericPopupWindow from "../Popup/GenericPopup";
import Button from "react-bootstrap/Button";
function AdminPanel(props) {
  const [fileUploadPopup, setFileUploadPopup] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [mainContentString, setMainContentString] = useState("");
  const [images, setImages] = useState([]);

  const fetchImages = ()  => {
    Axios.get("http://localhost:5000/api/getIcons").then((response) => {
      setImages(response.data);
    }).catch((err) => {
      console.log(err);
    });
  }

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
                      <tr className="tr" key={image.icon_id}>
                        <td>{image.icon_id}</td>
                        <td>
                          <img
                            src={"/images/" + image.file_name}
                            alt={image.name}
                            className="images"
                          />
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
