import { useState } from "react";

import FileUploads from "../Popup/FileUploads";
import GenericPopupWindow from "../Popup/GenericPopup";

function AdminPanel(props) {
  const [fileUploadPopup, setFileUploadPopup] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [mainContentString, setMainContentString] = useState("");

  return (
    <div className="admin-ui">
      {console.log(props)}
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
            <button
              className="btn btn-primary"
              onClick={() => {
                props.flushMarkers();
                setMainContentString("flush-markers");
              }}
            >
              FlushMarkers
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setFileUploadPopup(true);
                setMainContentString("file-upload");
              }}
            >
              Upload File
            </button>
            <FileUploads
              show={fileUploadPopup}
              onHide={() => {
                setFileUploadPopup(false);
              }}
            />
            {console.log(fileUploadPopup)}
          </div>
          <div className="admin-panel-main">
            <h2>List of Images:</h2>
            <div className="list-image-container">
              <table className="tables">
                <thead>
                  <tr className="tr">
                    <th>Image Name</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                
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
