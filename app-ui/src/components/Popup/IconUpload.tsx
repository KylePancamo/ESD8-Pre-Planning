import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Axios from "axios";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useRecoilState } from "recoil";
import { imagesState } from "../../atoms";
import { Image } from "../../types/atoms-types";

type FileUploadProps = {
  show: boolean;
  onHide: () => void;
}

type IconUpload = {
  file_name: string;
  icon_id: number;
  icon_name: string;
}


function FileUpload(props: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>("");
  const [FileUploadStatus, setFileUploadStatus] = useState<boolean | undefined>(undefined);
  const [FileUploadString, setFileUploadString] = useState<string>("");
  const [iconName, setIconName] = useState<string>("");
  const [images, setImages] = useRecoilState<Image[]>(imagesState);

  const handleFileUpload = () => {
    inputRef.current?.click();
  };

  const handleDisplayFileDetails = () => {
    if (iconName.length > 0) {
      const file: FileList | null | undefined = inputRef.current?.files;
      if (file?.length !== undefined) {
        if (file?.length > 0) {
          // create formData object and append file data to it. Then make axios request to backend
          const formData = new FormData();
          formData.append("file", file[0]);
          formData.append('iconName', iconName);

          Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/upload-icon", formData, {withCredentials: true})
            .then((response) => {
              setFileUploadStatus(true);
              setFileUploadString(response.data.message);
              setFileName(file[0].name);
              setImages((currImages: IconUpload[]) => [
                ...currImages,
                response.data.payload,
              ]);
            })
            .catch((error) => {
              console.log(error);
              setFileUploadStatus(false);
              setFileUploadString(error.response.data.message);
            });
        }
      }
    } else {
      setFileUploadStatus(false);
      setFileUploadString("Please enter an icon name");
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onExit={() => {
          setFileUploadStatus(undefined);
          setFileUploadString("");
          setFileName("");
          setIconName("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="m-2">
            Icon Upload
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="file-uploads">
              <label className="mx-3">Choose File: </label>
                <Form.Control
                  id="input-file"
                  className="d-none"
                  type="file"
                  ref={inputRef}
                  onChange={handleDisplayFileDetails}
                />
                {(FileUploadStatus === undefined || FileUploadStatus === false) ? (
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Enter icon name"
                        onChange={(e) => {
                          setIconName(e.target.value);
                        }}
                        style={{width: "75%"}}
                      />
                    </Form.Group>
                  ) : null }
                <Button
                  onClick={handleFileUpload}
                  style={{ width: "fit-content" }}
                  className={`btn btn-outline-${fileName ? "success" : "danger"}`}
                >
                  {fileName ? fileName : "Upload"}
                </Button>
            </div>
          </div>
          {FileUploadStatus === true ? (
            <Alert variant="success" className="m-2">
              {FileUploadString}
            </Alert>
          ) : null}

          {FileUploadStatus === false ? (
            <Alert variant="danger" className="m-2">
              {FileUploadString}
            </Alert>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => props.onHide()}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FileUpload;
