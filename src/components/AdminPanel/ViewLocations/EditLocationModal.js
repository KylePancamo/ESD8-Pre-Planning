import React, { useEffect, useState } from "react";
import GenericPopupWindow from "../../Popup/GenericPopup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import states from "../states";
import fetchPreplanData from "./fetchPreplanData";
import { Autocomplete } from "@react-google-maps/api";  
import Alert from "react-bootstrap/Alert";

function EditLocation(props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [locationEditResponse, setLocationEditResponse] = useState({});
  const [preplanData, setpreplanData] = useState({});

  const [searchBox, setSearchBox] = useState(null);

  function onLoad(autocomplete) {
    setSearchBox(autocomplete);
  }

  function onPlaceChanged() {
    if (searchBox != null) {
      const place = searchBox.getPlace();
      const formattedAddress = place.formatted_address;
      let addressArray = formattedAddress.split(',');

      let occupancyaddress = addressArray[0].trim();
      let city = addressArray[1].trim();
      let state = addressArray[2].split(' ')[1].trim();
      let zip = addressArray[2].split(' ')[2].trim();
      setValue("streetAddress", occupancyaddress);
      setValue("city", city);
      setValue("state", state);
      setValue("zipCode", zip);
    } else {
      alert("Please enter text");
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    Axios.post("http://localhost:5000/api/update-preplanning-location", {
      payload: data,
      id: props.selectedEditLocation.id,
    }, {
      withCredentials: true,
    })
      .then((response) => {
        setLocationEditResponse(response.data);
        props.updateLocations({
          id: props.selectedEditLocation.id,
          occupancyname: data.occupancyName,
          occupancyaddress: data.streetAddress,
        });
      })
      .catch((error) => {
        setLocationEditResponse(error.response?.data);
      });
  };

  return (
    <GenericPopupWindow
      show={props.show}
      onHide={() => props.onHide(false)}
      contentClassName="edit-location-modal"
      title="Edit Location"
      onEntering={() => {
        fetchPreplanData(reset, props);
      }}
      onExit={() => {
        setLocationEditResponse({});
      }}
    >
      <Form
        className="location-form"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <Form.Group className="occupancy-group">
          <Container>
            <Row className="row">
              <Col>
                <Form.Label style={{ fontWeight: "bold" }}>
                  Occupancy Information
                </Form.Label>
              </Col>
            </Row>
            <Row className="row">
              <Col>
                  <Form.Label>
                    Occupancy Name
                  </Form.Label>
                <Form.Control
                  {...register("occupancyName", {
                    required: {
                      value: true,
                      message: "Please enter an Occupancy Name",
                    },
                  })}
                  type="text"
                  placeholder="Occupancy Name"
                />
                {errors.occupancyName && (
                  <span style={{ color: "red" }}>
                    {errors.occupancyName.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Occupancy Type
                </Form.Label>
                <Form.Control
                  {...register("occupancyType", {
                    required: {
                      value: true,
                      message: "Please enter an Occupancy Type",
                    },
                  })}
                  type="text"
                  placeholder="Occupancy Type"
                />
                {errors.occupancyType && (
                  <span style={{ color: "red" }}>
                    {errors.occupancyType.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Contact Name
                </Form.Label>
                <Form.Control
                  {...register("contactName", {
                    required: {
                      value: true,
                      message: "Please enter a Contact Name",
                    },
                  })}
                  type="text"
                  placeholder="Contact Name"
                />
                {errors.contactName && (
                  <span style={{ color: "red" }}>
                    {errors.contactName.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Emergency Contact
                </Form.Label>
                <Form.Control
                  {...register("emergencyContact", {
                    required: {
                      value: true,
                      message: "Please enter an Emergency Contact",
                    },
                  })}
                  type="text"
                  placeholder="Emergency Contact"
                />
                {errors.emergencyContact && (
                  <span style={{ color: "red" }}>
                    {errors.emergencyContact.message}
                  </span>
                )}
              </Col>
            </Row>
            <Row className="row" style={{ width: "25.8%" }}>
              <Col>
                <Form.Label>
                  Contruction Type
                </Form.Label>
                <Form.Control
                  {...register("constructionType", {
                    required: { value: true, message: "Please enter a number" },
                  })}
                  type="number"
                  placeholder="Construction Type"
                />
                {errors.constructionType && (
                  <span style={{ color: "red" }}>
                    {errors.constructionType.message}
                  </span>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>
        <Form.Group className="address-group">
          <Container>
            <Row className="row">
              <Form.Label style={{ fontWeight: "bold" }}>Address</Form.Label>
            </Row>
            <Row className="row">
              <Col>
                <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                  <Form.Control
                    type="text"
                    placeholder="Search for Address Location"
                  />
                </Autocomplete>
                <Form.Label>
                  Street Address
                </Form.Label>
                <Form.Control
                  {...register("streetAddress", {
                    required: {
                      value: true,
                      message: "Please enter a Street Address",
                    },
                  })}
                  type="text"
                  placeholder="Street Address"
                />
                {errors.streetAddress && (
                  <span style={{ color: "red" }}>
                    {errors.streetAddress.message}
                  </span>
                )}
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  City
                </Form.Label>
                <Form.Control
                  {...register("city", {
                    required: { value: true, message: "Please enter a City" },
                  })}
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="City"
                />
                {errors.city && (
                  <span style={{ color: "red" }}>{errors.city.message}</span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  State
                </Form.Label>
                <Form.Select
                  {...register("state", {
                    required: { value: true, message: "Please select a state" },
                  })}
                  aria-label="Default select example"
                >
                  <option value="">State</option>
                  {states.map((state) => {
                    return (
                      <option value={state.abbreviation} key={state.abbreviation}>
                        {state.abbreviation} - {state.name}
                      </option>
                    );
                  })}
                </Form.Select>
                {errors.state && (
                  <span style={{ color: "red" }}>{errors.state.message}</span>
                )}
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Zip Code
                </Form.Label>
                <Form.Control
                  {...register("zipCode", {
                    required: {
                      value: true,
                      message: "Please enter a Zip Code",
                    },
                  })}
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Postal / Zip Code"
                />
                {errors.zipCode && (
                  <span style={{ color: "red" }}>{errors.zipCode.message}</span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Country
                </Form.Label>
                <Form.Control
                  {...register("country", {
                    required: {
                      value: true,
                      message: "Please enter an Country",
                    },
                  })}
                  style={{ width: "100%" }}
                  type="text"
                  placeholder="Country"
                  defaultValue="USA"
                />
                {errors.country && (
                  <span style={{ color: "red" }}>{errors.country.message}</span>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>
        <Form.Group className="mutual-aid-group">
          <Container>
            <Row className="row">
              <Form.Label style={{ fontWeight: "bold" }}>Mutual Aid Information</Form.Label>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Mutual Aid
                </Form.Label>
                <Form.Control
                  {...register("mutual_aid1", {
                    required: { value: true, message: "Please enter a number" },
                  })}
                  type="number"
                  placeholder="Mutual Aid"
                />
              </Col>
              <Col>
                <Form.Label>
                  Mutual Aid
                </Form.Label>
                <Form.Control
                  {...register("mutual_aid2", {
                    required: { value: true, message: "Please enter a number" },
                  })}
                  type="number"
                  placeholder="Mutual Aid"
                />
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Mutual Aid
                </Form.Label>
                <Form.Control
                  {...register("mutual_aid3", {
                    required: { value: true, message: "Please enter a number" },
                  })}
                  type="number"
                  placeholder="Mutual Aid"
                />
              </Col>
              <Col>
                <Form.Label>
                  Mutual Aid
                </Form.Label>
                <Form.Control
                  {...register("mutual_aid4", {
                    required: { value: true, message: "Please enter a number" },
                  })}
                  type="number"
                  placeholder="Mutual Aid"
                />
              </Col>
            </Row>
          </Container>
        </Form.Group>
        <Form.Group className="occupancy-specific-group">
          <Container>
            <Row className="row">
              <Form.Label style={{ fontWeight: "bold" }}>Occupancy Specific Information</Form.Label>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Hazard
                </Form.Label>
                <Form.Control
                  {...register("hazards", {
                    required: { value: true, message: "Please enter a Hazard" },
                  })}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Hazards"
                />
                {errors.hazards && (
                  <span style={{ color: "red" }}>{errors.hazards.message}</span>
                )}
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Hydrant Address
                </Form.Label>
                <Form.Control
                  {...register("hydrantAddress", {
                    required: {
                      value: true,
                      message: "Please enter a Hydrant Address",
                    },
                  })}
                  type="text"
                  placeholder="Hydrant Address"
                />
                {errors.hydrantAddress && (
                  <span style={{ color: "red" }}>
                    {errors.hydrantAddress.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Hydrant Distance (feet)
                </Form.Label>
                <Form.Control
                  {...register("hydrantDistance", {
                    required: { value: true, message: "Please enter a number" },
                  })}
                  type="number"
                  placeholder="Hydrant Distance (feet)"
                />
                {errors.hydrantDistance && (
                  <span style={{ color: "red" }}>
                    {errors.hydrantDistance.message}
                  </span>
                )}
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Access Information
                </Form.Label>
                <Form.Control
                  {...register("accessInformation", {
                    required: {
                      value: true,
                      message: "Please enter Access Information",
                    },
                  })}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Access Information"
                />
                {errors.accessInformation && (
                  <span style={{ color: "red" }}>
                    {errors.accessInformation.message}
                  </span>
                )}
              </Col>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Electric Meter Location
                </Form.Label>
                <Form.Control
                  {...register("electricMeterLoc", {
                    required: {
                      value: true,
                      message: "Please enter an Electric Meter Location",
                    },
                  })}
                  as="textarea"
                  type="text"
                  placeholder="Electic Meter Location"
                />
                {errors.electricMeterLoc && (
                  <span style={{ color: "red" }}>
                    {errors.electricMeterLoc.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Breaker Box Location
                </Form.Label>
                <Form.Control
                  {...register("breakerBoxLoc", {
                    required: {
                      value: true,
                      message: "Please enter a Breaker Box Location",
                    },
                  })}
                  as="textarea"
                  type="text"
                  placeholder="Breaker Box Location"
                />
                {errors.breakerBoxLoc && (
                  <span style={{ color: "red" }}>
                    {errors.breakerBoxLoc.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Water Shutoff Location
                </Form.Label>
                <Form.Control
                  {...register("waterLoc", {
                    required: {
                      value: true,
                      message: "Please enter a Water Location",
                    },
                  })}
                  as="textarea"
                  rows={2}
                  type="text"
                  placeholder="Water Location"
                />
                {errors.waterLoc && (
                  <span style={{ color: "red" }}>
                    {errors.waterLoc.message}
                  </span>
                )}
              </Col>
              <Col>
                <Form.Label>
                  Gas Shutoff Location
                </Form.Label>
                <Form.Control
                  {...register("gasShutoffLoc", {
                    required: {
                      value: true,
                      message: "Please enter a Gas Shutoff Location",
                    },
                  })}
                  as="textarea"
                  rows={2}
                  type="text"
                  placeholder="Gas Shutoff Location"
                />
                {errors.gasShutoffLoc && (
                  <span style={{ color: "red" }}>
                    {errors.gasShutoffLoc.message}
                  </span>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>
        <Form.Group className="misc-notes-group">
          <Container>
            <Row className="row">
              <Form.Label style={{ fontWeight: "bold" }}>Miscellaneous Notes</Form.Label>
            </Row>
            <Row className="row">
              <Col>
                <Form.Label>
                  Notes
                </Form.Label>
                <Form.Control
                  {...register("notes", {
                    required: {
                      value: true,
                      message: "Please enter any notes",
                    },
                  })}
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Notes"
                />
                {errors.notes && (
                  <span style={{ color: "red" }}>{errors.notes.message}</span>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {locationEditResponse?.status === "success" ? (
          <Alert variant="success" className="m-2">
              {locationEditResponse?.message}
          </Alert>
        ) : locationEditResponse?.status === "error" ? (
          <Alert variant="success" className="m-2">
              {locationEditResponse?.message}
          </Alert>
        ) : null}
      </Form>
    </GenericPopupWindow>
  );
}

export default React.memo(EditLocation);
