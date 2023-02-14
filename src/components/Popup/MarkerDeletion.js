import React from "react";
import GenericPopupWindow from "./GenericPopup";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";

function MarkerDeletion({
  markerSaved,
  setMarkerSaved,
  markerDeleted,
  setMarkerDeleted,
  props,
}) {
  const handleMarkerDelete = () => {
    const data = {
      marker_id: props.selectedMarker.marker_id,
    };
    console.log(props.selectedMarker)
    Axios.delete("http://localhost:5000/api/delete-selected-marker",  {
      withCredentials: true,
      data: data,
    }  )
      .then((response) => {
        // remove marker from props.markers array
        props.setMarkers((markers) => {
          let newMarkers = markers.filter(
            (marker) => marker.marker_id !== props.selectedMarker.marker_id
          );
          localStorage.setItem("markers", JSON.stringify(newMarkers));
          return newMarkers;
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setMarkerDeleted(false);
    props.onHide();
  };

  return (
    <>
      <GenericPopupWindow
        show={markerSaved}
        onHide={() => setMarkerSaved(false)}
        title="Marker Saved"
      >
        <Alert variant="success">
          The marker icon was successfully changed. You can close this box
        </Alert>
      </GenericPopupWindow>
      <GenericPopupWindow
        show={markerDeleted}
        onHide={() => setMarkerDeleted(false)}
        title="Marker Deletion Warning"
        extraButton={"Delete Marker"}
        extraAction={handleMarkerDelete}
      >
        <Alert variant="danger">
          Are you sure you want to delete this marker? This action cannot be
          undone.
        </Alert>
      </GenericPopupWindow>
    </>
  );
}

export default MarkerDeletion;
