import React, { useState } from "react";
import GenericPopupWindow from "./GenericPopup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import states from "./states";
import fetchPreplanData from "./fetchPreplanData";
import { Autocomplete } from "@react-google-maps/api";  
import Alert from "react-bootstrap/Alert";
import { LocationTypes } from "../../types/location-types";

type EditLocationProps = {
  show: boolean;
  onHide: (show: boolean) => void;
  selectedEditLocation: LocationTypes;
  setSelectedEditLocaton: React.Dispatch<React.SetStateAction<LocationTypes>>;
  updateLocations: (newVal: LocationTypes, id: number) => void;
}



type FormValues = {
  [key: string]: string;
};

type LocationEditResponse = {
  status: string;
  message: string;
  err?: string;
}



function EditLocation(props : EditLocationProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const [locationEditResponse, setLocationEditResponse] = useState<LocationEditResponse>({
    status: "",
    message: "",
    err: "",
  });

  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();

  function onLoad(autocomplete: google.maps.places.Autocomplete) {
    setSearchBox(autocomplete);
  }

  console.log(props.selectedEditLocation);

  function onPlaceChanged() {
    if (searchBox != null) {
      const place = searchBox.getPlace();
      const formattedAddress: string = place.formatted_address === undefined ? "" : place.formatted_address;
      let addressArray = formattedAddress.split(',');

      let occupancyaddress = addressArray[0].trim();
      let city = addressArray[1].trim();
      let state = addressArray[2].split(' ')[1].trim();
      let zip = addressArray[2].split(' ')[2] != undefined ? addressArray[2].split(' ')[2].trim() : "";
      setValue("streetAddress", occupancyaddress);
      setValue("city", city);
      setValue("state", state);
      setValue("zipCode", zip);
    } else {
      alert("Please enter text");
    }
  }

  const onSubmit = (data: FormValues) => {
    Axios.post(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/update-preplanning-location", {
      payload: data,
      googleAddress: searchBox?.getPlace() ? searchBox?.getPlace().formatted_address : props.selectedEditLocation.google_formatted_address,
      id: props.selectedEditLocation.id,
    }, {
      withCredentials: true,
    })
      .then((response) => {
        props.setSelectedEditLocaton({
          ...props.selectedEditLocation,
          occupancyname: data.occupancyName,
          occupancytype: data.occupancyType,
          hazards: data.hazards,
          other_notes: data.notes,
          access: data.accessInformation,
          breaker_box: data.breakerBoxLoc,
          constructiontype: parseInt(data.constructionType),
          contactname: data.contactName,
          electric_meter: data.electricMeterLoc,
          emergency_contact_number: data.emergencyContact,
          gas_shutoff: data.gasShutoffLoc,
          hydrant_address: data.hydrantAddress,
          hydrant_distance: Number(data.hydrantDistance),
          mut_aid_bc2fd: parseInt(data.mutual_aid1),
          mut_aid_d7fr: parseInt(data.mutual_aid2),
          mut_aid_helotesfd: parseInt(data.mutual_aid3),
          google_formatted_address: searchBox?.getPlace() ? searchBox.getPlace().formatted_address as string : props.selectedEditLocation.google_formatted_address as string, 
          latitude: props.selectedEditLocation.latitude,
          longitude: props.selectedEditLocation.longitude,
          mut_aid_leonspringsvfd: parseInt(data.mutual_aid4),
          occupancyaddress: data.streetAddress,
          occupancycity: data.city,
          occupancystate: data.state,
          occupancyzip: data.zipCode,
          occupancycountry: data.country,
          water: data.waterLoc,
        })

        setLocationEditResponse(response.data);
        props.updateLocations({
          occupancyname: data.occupancyName,
          occupancytype: data.occupancyType,
          hazards: data.hazards,
          other_notes: data.notes,
          access: data.accessInformation,
          breaker_box: data.breakerBoxLoc,
          constructiontype: parseInt(data.constructionType),
          contactname: data.contactName,
          electric_meter: data.electricMeterLoc,
          emergency_contact_number: data.emergencyContact,
          gas_shutoff: data.gasShutoffLoc,
          hydrant_address: data.hydrantAddress,
          hydrant_distance: Number(data.hydrantDistance),
          mut_aid_bc2fd: parseInt(data.mutual_aid1),
          mut_aid_d7fr: parseInt(data.mutual_aid2),
          mut_aid_helotesfd: parseInt(data.mutual_aid3),
          google_formatted_address: searchBox?.getPlace() ? searchBox.getPlace().formatted_address as string : props.selectedEditLocation.google_formatted_address as string, 
          latitude: props.selectedEditLocation.latitude,
          longitude: props.selectedEditLocation.longitude,
          mut_aid_leonspringsvfd: parseInt(data.mutual_aid4),
          occupancyaddress: data.streetAddress,
          occupancycity: data.city,
          occupancystate: data.state,
          occupancyzip: data.zipCode,
          occupancycountry: data.country,
          water: data.waterLoc,
        }, props.selectedEditLocation.id as number);
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
        fetchPreplanData(reset, props.selectedEditLocation.id as number);
      }}
      onExit={() => {
        setLocationEditResponse({
          status: "",
          message: "",
          err: "",
        });
      }}
    >
      <Form
        className="location-form"
        onSubmit={handleSubmit((data: FormValues) => onSubmit(data))}
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
                {errors?.occupancyName && (
                  <span style={{ color: "red" }}>
                    {errors?.occupancyName.message}
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
                {errors?.occupancyType && (
                  <span style={{ color: "red" }}>
                    {errors?.occupancyType.message}
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
                {errors?.contactName && (
                  <span style={{ color: "red" }}>
                    {errors?.contactName.message}
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
                {errors?.emergencyContact && (
                  <span style={{ color: "red" }}>
                    {errors?.emergencyContact.message}
                  </span>
                )}
              </Col>
            </Row>
            <Row className="row" style={{ width: "100%"}}>
              <Col>
                <Form.Label>Construction Type</Form.Label>
                <Row>
                  <Col xs={4}>
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="1"
                      label="I - Fire Resistive"
                    />
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="2"
                      label="II - Non-Combustible"
                    />
                    
                  </Col>
                  <Col xs={4}>
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="3"
                      label="III - Ordinary"
                    />
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="4"
                      label="IV - Heavy Timber"
                    />
                  </Col>
                  <Col xs={4}>
                  <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="5"
                      label="V - Wood Frame"
                    />
                  <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="5"
                      label="VI - Light Weight Wood Truss"
                    /></Col>
                </Row>
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
                {errors?.streetAddress && (
                  <span style={{ color: "red" }}>
                    {errors?.streetAddress.message}
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
                {errors?.city && (
                  <span style={{ color: "red" }}>{errors?.city.message}</span>
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
                {errors?.state && (
                  <span style={{ color: "red" }}>{errors?.state.message}</span>
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
                {errors?.zipCode && (
                  <span style={{ color: "red" }}>{errors?.zipCode.message}</span>
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
                {errors?.country && (
                  <span style={{ color: "red" }}>{errors?.country.message}</span>
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
                {errors?.hazards && (
                  <span style={{ color: "red" }}>{errors?.hazards.message}</span>
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
                {errors?.hydrantAddress && (
                  <span style={{ color: "red" }}>
                    {errors?.hydrantAddress.message}
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
                {errors?.hydrantDistance && (
                  <span style={{ color: "red" }}>
                    {errors?.hydrantDistance.message}
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
                {errors?.accessInformation && (
                  <span style={{ color: "red" }}>
                    {errors?.accessInformation.message}
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
                {errors?.electricMeterLoc && (
                  <span style={{ color: "red" }}>
                    {errors?.electricMeterLoc.message}
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
                {errors?.breakerBoxLoc && (
                  <span style={{ color: "red" }}>
                    {errors?.breakerBoxLoc.message}
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
                {errors?.waterLoc && (
                  <span style={{ color: "red" }}>
                    {errors?.waterLoc.message}
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
                {errors?.gasShutoffLoc && (
                  <span style={{ color: "red" }}>
                    {errors?.gasShutoffLoc.message}
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
                {errors?.notes && (
                  <span style={{ color: "red" }}>{errors?.notes.message}</span>
                )}
              </Col>
            </Row>
          </Container>
        </Form.Group>
        <Button id="location-modal-submit" variant="primary" type="submit">
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
