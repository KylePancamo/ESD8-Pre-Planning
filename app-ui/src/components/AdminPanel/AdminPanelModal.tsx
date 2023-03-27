import { useState } from "react";
import IconUpload from "../Popup/IconUpload";
import GenericPopupWindow from "../Popup/GenericPopup";
import Button from "react-bootstrap/Button";
import IconEditWindow from "./IconEditWindow";
import {useRecoilState} from 'recoil';
import {imagesState} from "../../atoms";
import React from "react";
import { Image } from "../../types/atoms-types";
import { useAuth } from "../../hooks/AuthProvider";
import { permission } from "../../permissions";
import { hasPermissions } from '../../helpers';
import { Link } from "react-router-dom";

type AdminPanelProps = {
  flushMarkers: () => void;
}


function AdminPanel(props: AdminPanelProps) {
  const [fileUploadPopup, setFileUploadPopup] = useState<boolean>(false);
  const [adminPanel, setAdminPanel] = useState<boolean>(false);
  const [images, setImages] = useRecoilState<Image[]>(imagesState);
  const [iconEditState, setIconEditState] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<Image>();

  const { userData } = useAuth();

  return (
    <>
    {hasPermissions(userData?.permissions, permission.MODIFY) ? (
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
                variant="warning"
                onClick={() => {
                  localStorage.clear();
                }}
              >
                Clear Cache
              </Button>
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
              <Button>
                <Link style={{color: 'white'}} to='/adminportal' target="_blank">Admin Portal</Link>
              </Button>
              <IconUpload
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
                              alt={image.file_name}
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
        {iconEditState ? (
          <IconEditWindow
            show={iconEditState}
            onHide={() => setIconEditState(false)}
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
            contentClassName="modal-edit-icon"
            setImages={setImages}
          />
        ) : null}
      </div>
    ) : null}
    </>
  );
}

export default React.memo(AdminPanel);