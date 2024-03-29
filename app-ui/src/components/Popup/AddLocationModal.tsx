import React, { useEffect, useState } from "react";
import GenericPopupWindow from "./GenericPopup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import states from "./states";
import { Autocomplete } from "@react-google-maps/api";
import Alert from "react-bootstrap/Alert";
import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import { LocationTypes } from "../../types/location-types";

type AddLocationProps = {
  show: boolean;
  onHide: () => void;
  address: LocationTypes;
}

type FormValues = {
  [key: string]: string | string[];
};

type LocationAddedResponse = {
  status: string;
  message: string;
  err?: string;
}

function AddLocation({ show, onHide, address } : AddLocationProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      mutualAid: ["1", "2", "3", "4"]
    }
  });
  const [locationAddedResponse, setLocationAddedResponse] = useState<LocationAddedResponse>({
    status: "",
    message: "",
    err: "",
  });

  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();
  const { addNewLocation } = usePrePlanningLocations();

  function onLoad(autocomplete: google.maps.places.Autocomplete) {
    setSearchBox(autocomplete);
  }

  function onPlaceChanged() { 
    if (searchBox != null) {
      const place = searchBox.getPlace();
      const formattedAddress = place.formatted_address === undefined ? "" : place.formatted_address;

      const addressArray = formattedAddress.split(',');

      const occupancyaddress = addressArray[0].trim();
      const city = addressArray[1].trim();
      const state = addressArray[2].split(' ')[1].trim();
      const zip = addressArray[2].split(' ')[2] ? addressArray[2].split(' ')[2].trim() : null;
      setValue("streetAddress", occupancyaddress);
      setValue("city", city);
      setValue("state", state);
      zip ? setValue("zipCode", zip) : setValue("zipCode", "");
    } else {
      alert("Please enter text");
    }
  }
  const onSubmit = (data: FormValues) => {
    Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/add-preplanning-location", {
      payload: {
        data: data,
        address: address,
      },
    }, { withCredentials: true })
      .then((response) => {
        setLocationAddedResponse({
          status: response.data.status,
          message: response.data.message,
        });
        // add a new location to the preplanning locations state
        addNewLocation({
          id: response.data.locationId,
          occupancyname: data.occupancyName as string,
          occupancy_types: data.occupancyType as string[],
          hazards: data.hazards as string,
          other_notes: data.notes as string,
          access: data.accessInformation as string,
          breaker_box: data.breakerBoxLoc as string,
          construction_types: data.constructionType as string[],
          contactname: data.contactName as string,
          electric_meter: data.electricMeterLoc as string,
          emergency_contact_number: data.emergencyContact as string,
          gas_shutoff: data.gasShutoffLoc as string,
          hydrant_address: data.hydrantAddress as string,
          hydrant_distance: Number(data.hydrantDistance as string),
          mutual_aids: data.mutualAid as string[],
          google_formatted_address: searchBox?.getPlace() ? searchBox.getPlace().formatted_address as string : address.google_formatted_address as string, 
          latitude: searchBox?.getPlace() ? searchBox.getPlace().geometry?.location?.lat() as number : address.latitude,
          longitude: searchBox?.getPlace() ? searchBox.getPlace().geometry?.location?.lng() as number: address.longitude,
          occupancyaddress: data.streetAddress as string,
          occupancycity: data.city as string,
          occupancystate: data.state as string,
          occupancycountry: data.country as string,
          occupancyzip: data.zipCode as string,
          water: data.waterLoc as string,
        });
      })
      .catch((error) => {
        setLocationAddedResponse(error.response.data);
      });
  };

  useEffect(() => {
    reset();
  }, [show]);

  return (
    <GenericPopupWindow
      show={show}
      onHide={() => onHide()}
      contentClassName="add-location-modal"
      title="Add Location"
      onEntering={() => {
        const addressArray = address.google_formatted_address.split(',');

        const occupancyaddress = addressArray[0] ? addressArray[0].trim() : "";
        const city = addressArray[1] ? addressArray[1].trim() : "";
        const state = addressArray[2] ? addressArray[2].split(' ')[1].trim() : "";
        const zip = addressArray[2] ? addressArray[2].split(' ')[2].trim() : "";
        setValue("streetAddress", occupancyaddress);
        setValue("city", city);
        setValue("state", state);
        setValue("googleAddress", address.google_formatted_address)
        zip ? setValue("zipCode", zip) : setValue("zipCode", "");
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
          </Container>
        </Form.Group>
        <Form.Group>
          <Container>
          <Row className="row">
              <Form.Label style={{ fontWeight: "bold" }}>Occupancy Type</Form.Label>
          </Row>
          <Row className="row" style={{ width: "100%"}}>
              <Col>
                <Row>
                  <Col xs={4}>
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="1"
                      id="assembly"
                      label={<Form.Label htmlFor="assembly">Assembly</Form.Label>}
                    />
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="2"
                      id="commercial"
                      label={<Form.Label htmlFor="commercial">Commercial</Form.Label>}
                    />
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="3"
                      id="educational"
                      label={<Form.Label htmlFor="educational">Educational</Form.Label>}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="4"
                      id="hazardous"
                      label={<Form.Label htmlFor="hazardous">Hazardous</Form.Label>}
                    />
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="5"
                      id="industrial"
                      label={<Form.Label htmlFor="industrial">Industrial</Form.Label>}
                    />
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="6"
                      id="institutional"
                      label={<Form.Label htmlFor="institutional">Insitiutional</Form.Label>}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="7"
                      id="mercantile"
                      label={<Form.Label htmlFor="mercantile">Mercantile</Form.Label>}
                    />
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="8"
                      id="residential"
                      label={<Form.Label htmlFor="residential">Residential</Form.Label>}
                    />
                    <Form.Check
                      {...register("occupancyType")}
                      type="checkbox"
                      value="9"
                      id="storage"
                      label={<Form.Label htmlFor="storage">Storage</Form.Label>}
                    />
                  </Col>
                </Row>
              </Col>
          </Row>
          </Container>
        </Form.Group>
        <Form.Group>
          <Container>
            <Row className="row">
                <Form.Label style={{ fontWeight: "bold" }}>Construction Type</Form.Label>
            </Row>
            <Row className="row" style={{ width: "100%"}}>
              <Col>
                <Row>
                  <Col xs={4}>
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="1"
                      id="fireResistive"
                      label={<Form.Label htmlFor="fireResistive">I - Fire Resistive</Form.Label>}
                    />
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="2"
                      id="nonCombustible"
                      label={<Form.Label htmlFor="nonCombustible">II - Non-Combustible</Form.Label>}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="3"
                      id="ordinary"
                      label={<Form.Label htmlFor="ordinary">III - Ordinary</Form.Label>}
                    />
                    <Form.Check
                      {...register("constructionType")}
                      type="checkbox"
                      value="4"
                      id="heavyTimber"
                      label={<Form.Label htmlFor="heavyTimber">IV - Heavy Timber</Form.Label>}
                    />
                  </Col>
                  <Col xs={4}>
                    <Form.Check
                        {...register("constructionType")}
                        type="checkbox"
                        value="5"
                        id="woodFrame"
                        label={<Form.Label htmlFor="woodFrame">V - Wood Frame</Form.Label>}
                      />
                    <Form.Check
                        {...register("constructionType")}
                        type="checkbox"
                        value="6"
                        id="lightWeightWoodTruss"
                        label={<Form.Label htmlFor="lightWeightWoodTruss">VI - Light Weight Wood Truss</Form.Label>}
                      />
                  </Col>
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
                <Form.Label>
                  Google Street Address
                </Form.Label>
                <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
                  <Form.Group>
                    <Form.Control
                      {...register("googleAddress", {
                        required: {
                          value: true,
                          message: "Please search for a google address."
                        }
                      })}
                      type="text"
                      placeholder="Search Google Street Address"
                    />
                    {errors.googleAddress ? (
                      <span style={{ color: "red" }}>
                        {errors.googleAddress.message}
                      </span>
                    ) : 
                    <Form.Text className="text-muted">
                      Please search for a google address before submitting.
                    </Form.Text>
                    }
                    
                  </Form.Group>
                </Autocomplete>
              </Col>
            </Row>
            <Row className="row">
              <Col>
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
              <Form.Label style={{ fontWeight: "bold" }}>Mutual Aid</Form.Label>
            </Row>
            <Row className="row" style={{ width: "100%"}}>
              <Col>
                <Row>
                  <Col xs={6}>
                    <Form.Check
                      {...register("mutualAid")}
                      type="checkbox"
                      id="helotesFD"
                      value="1"
                      label={<Form.Label htmlFor="helotesFD">Helotes FD</Form.Label>}
                    />
                    <Form.Check
                      {...register("mutualAid")}
                      type="checkbox"
                      value="2"
                      id="district7FD"
                      label={<Form.Label htmlFor="district7FD">District 7 FD</Form.Label>}
                    />
                    
                  </Col>
                  <Col xs={6}>
                    <Form.Check
                      {...register("mutualAid")}
                      type="checkbox"
                      value="3"
                      id="leonSpringsFD"
                      label={<Form.Label htmlFor="leonSpringsFD">Leon Springs FD</Form.Label>}
                    />
                    <Form.Check
                      {...register("mutualAid")}
                      type="checkbox"
                      value="4"
                      id="district2FD"
                      label={<Form.Label htmlFor="district2FD">District 2 FD</Form.Label>}
                    />
                  </Col>
                </Row>
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
                  as="textarea"
                  placeholder="Hydrant Address"
                />
                {errors.hydrantAddress && (
                  <span style={{ color: "red" }}>
                    {errors.hydrantAddress.message}
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
        <Button id="location-modal-submit" variant="primary" type="submit">
          Submit
        </Button>
        {locationAddedResponse?.status === "success" ? (
          <Alert variant="success" className="m-2">
              {locationAddedResponse?.message}
          </Alert>
        ) : locationAddedResponse?.status === "error" ? (
          <Alert variant="success" className="m-2">
              {locationAddedResponse?.message}
          </Alert>
        ) : null}
      </Form>
    </GenericPopupWindow>
  );
}

export default React.memo(AddLocation);
