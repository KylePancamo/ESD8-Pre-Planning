import GenericEditWindow from "../Popup/GenericPopup";
import React from "react";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useRecoilState } from "recoil";
import { imagesState } from "../../atoms";

type IconEditWindowProps = {
  show: boolean;
  onHide: () => void;
  selectedIcon: any;
  setSelectedIcon: React.Dispatch<React.SetStateAction<any>>;
  contentClassName: string;
  setImages: React.Dispatch<React.SetStateAction<any>>
}

function IconEditWindow(props: IconEditWindowProps) {
  console.log("icon edit window")
  const [images, setImages] = useRecoilState(imagesState);
  const [iconUpdateStatus, setIconUpdateStatus] = useState({
    variant: "",
    message: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      iconName: props.selectedIcon?.icon_name
    }
  });

  const onSave = (data: any) => {
    Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/update-icon-name", {
      id: props.selectedIcon?.icon_id,
      formData: data,
    }, {
      withCredentials: true
    })
      .then((response) => {
        setIconUpdateStatus({
          variant: "success",
          message: response.data.message,
        });
        let newImages = images.map((image) => {
          if (image.icon_id === props.selectedIcon.icon_id)
            return { ...image, icon_name: data.iconName };
          else return image;
        });
        setImages(newImages);
      })
      .catch((err) => {
        setIconUpdateStatus({
          variant: "danger",
          message: err.response?.data.message,
        });
      });
  };

  return (
    <GenericEditWindow
      show={props.show}
      onHide={() => props.onHide()}
      title="Edit Icon"
      extraButton="Save"
      contentClassName="icon-edit-window"
      extraAction={handleSubmit((data) => onSave(data))}
      onExit={() => setIconUpdateStatus({ variant: "", message: "" })}
    >
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group>
          <Form.Label>
            Current Icon Name: <b>{props.selectedIcon?.icon_name}</b>
          </Form.Label>
          <Form.Control
            {...register("iconName", {
              required: {
                value: true,
                message: "Please enter a new icon name",
              },
            })}
            type="text"
            placeholder="Enter New Icon Name"
          />
        </Form.Group>
      </Form>
      {iconUpdateStatus.message !== "" ? (
        <Alert variant={iconUpdateStatus.variant} className="m-2">
          {iconUpdateStatus.message}
        </Alert>
      ) : null}
    </GenericEditWindow>
  );
}

export default IconEditWindow;