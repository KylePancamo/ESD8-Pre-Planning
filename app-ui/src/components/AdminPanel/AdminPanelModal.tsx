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
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import Loader from "../Loader";

type AdminPanelProps = {
  flushMarkers: () => void;
}


function AdminPanel(props: AdminPanelProps) {
  const [fileUploadPopup, setFileUploadPopup] = useState<boolean>(false);
  const [adminPanel, setAdminPanel] = useState<boolean>(false);
  const [images, setImages] = useRecoilState<Image[]>(imagesState);
  const [iconEditState, setIconEditState] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<Image>();
  const [deleteIconWindow, setDeleteIconWindow] = useState<boolean>(false);
  const [iconDeleteStatus, setIconDeleteStatus] = useState<{status: string, message: string}>({status: "", message: ""}); // ["none", "success", "error"
  const icon = React.useRef<any>();
  const [requesting, setRequesting] = useState<boolean>(false);
  const controller = new AbortController();

  const { userData } = useAuth();

  const deleteIcon = async () => {
    if (selectedIcon) {
      setRequesting(true);
      const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + `/api/delete-icon/`, {
        selectedIcon
      },{
        withCredentials: true,
        signal: controller.signal
      });


      if (response.data.status === "success") {
        setImages(images.filter((image) => image.icon_id !== selectedIcon?.icon_id));
        setDeleteIconWindow(false);
        setIconDeleteStatus({status: "success", message: "Icon deleted successfully!"});
        setRequesting(false);
      } else if (response.data.status === "error") {
        setDeleteIconWindow(false);
        setIconDeleteStatus({status: "error", message: response.data.message});
        setRequesting(false);
      }
    }
  }

  return (
    <>
    {hasPermissions(userData?.permissions, permission.MODIFY) ? (
      <div className="admin-ui">
        <Button
          className="admin-ui-trigger"
          variant="secondary"
          onClick={() => {
            setAdminPanel(true);
          }}
        >
          Admin Panel
        </Button>
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
                variant="secondary"
              >
                Upload Icon
              </Button>
              <Button variant="secondary">
                <Link style={{color: 'white'}} to='/adminportal' target="_blank">Admin Portal</Link>
              </Button>
              {fileUploadPopup ? (
                <IconUpload
                show={fileUploadPopup}
                onHide={() => {
                  setFileUploadPopup(false);
                }}
              />
              ) : null}
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
                        <tr className="image-body" key={image.icon_id} ref={icon}>
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
                              variant="secondary"
                            >Edit</Button>
                          </td>
                          {(image.icon_id !== 1 && hasPermissions(userData?.permissions, permission.DELETE)) ? (
                          <td>
                            <Button
                              onClick={() => {
                                setDeleteIconWindow(true);
                                setSelectedIcon(image);
                              }}
                              variant="danger"
                            >Delete</Button>
                          </td>
                          ) : null}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div style={{marginTop: "10px"}}>
            {deleteIconWindow ? (
                <Alert variant="danger" onClose={() => setDeleteIconWindow(false)} dismissible>
                  <Alert.Heading>WARNING!</Alert.Heading>
                  <div className="d-flex justify-content-between">
                    <p>You are about to perform a deletion on <strong><i><u>{selectedIcon?.icon_name}</u></i></strong> icon. Are you sure?</p>
                    <Button variant="outline-danger" onClick={deleteIcon}>
                      Delete
                    </Button>
                  </div>
                </Alert>
            ) : (iconDeleteStatus.status === "success") ? (
              <Alert variant="success" onClose={() => setIconDeleteStatus({status: "none", message: ""})} dismissible>
                {iconDeleteStatus.message}
              </Alert>
            ) : (iconDeleteStatus.status === "error") ? (
              <Alert variant="danger" onClose={() => setIconDeleteStatus({status: "", message: ""})} dismissible>
                <Alert.Heading>{iconDeleteStatus.message}</Alert.Heading>
              </Alert>
            ) : null}
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
        {requesting ? (
          <Loader />
        ) : null}
      </div>
    ) : null}
    </>
  );
}

export default React.memo(AdminPanel);