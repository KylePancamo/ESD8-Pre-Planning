import React, { useState } from "react";
import GenericPopupWindow from "./GenericPopup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Axios, { AxiosError } from "axios";
import states from "./states";
import { Autocomplete } from "@react-google-maps/api";  
import Alert from "react-bootstrap/Alert";
import { LocationTypes } from "../../types/location-types";

type EditLocationProps = {
  show: boolean;
  onHide: (show: boolean) => void;
  selectedEditLocation: LocationTypes;
  setSelectedEditLocaton: React.Dispatch<React.SetStateAction<LocationTypes>>;
  updateLocations: (newVal: LocationTypes, id: number) => void;
  removeLocation: (id: number) => void;
  locationInitalizer: LocationTypes;
}

type FormValues = {
  [key: string]: string | string[];
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
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      occupancyName: props.selectedEditLocation.occupancyname,
      occupancyType: props.selectedEditLocation.occupancy_types,
      hazards: props.selectedEditLocation.hazards,
      accessInformation: props.selectedEditLocation.access,
      breakerBoxLoc: props.selectedEditLocation.breaker_box,
      constructionType: props.selectedEditLocation.construction_types,
      contactName: props.selectedEditLocation.contactname,
      electricMeterLoc: props.selectedEditLocation.electric_meter,
      emergencyContact: props.selectedEditLocation.emergency_contact_number,
      gasShutoffLoc: props.selectedEditLocation.gas_shutoff,
      hydrantAddress: props.selectedEditLocation.hydrant_address,
      mutualAid: props.selectedEditLocation.mutual_aids,
      notes: props.selectedEditLocation.other_notes,
      occupancyAddress: props.selectedEditLocation.occupancyaddress,
      occupancyCity: props.selectedEditLocation.occupancycity,
      state: props.selectedEditLocation.occupancystate,
      zipCode: props.selectedEditLocation.occupancyzip,
      waterLoc: props.selectedEditLocation.water,
    },
  });
  const [locationEditResponse, setLocationEditResponse] = useState<LocationEditResponse>({
    status: "",
    message: "",
    err: "",
  });

  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();
  const [deleteLocationWindow, setDeleteLocationWindow] = useState<boolean>(false);

  function onLoad(autocomplete: google.maps.places.Autocomplete) {
    setSearchBox(autocomplete);
  }

  function onPlaceChanged() {
    if (searchBox != null) {
      const place = searchBox.getPlace();
      const formattedAddress: string = place.formatted_address === undefined ? "" : place.formatted_address;
      const addressArray = formattedAddress.split(',');

      const occupancyaddress = addressArray[0].trim();
      const city = addressArray[1].trim();
      const state = addressArray[2].split(' ')[1].trim();
      const zip = addressArray[2].split(' ')[2] != undefined ? addressArray[2].split(' ')[2].trim() : "";
      setValue("occupancyAddress", occupancyaddress);
      setValue("occupancyCity", city);
      setValue("state", state);
      setValue("zipCode", zip);
    } else {
      alert("Please enter text");
    }
  }

  const onSubmit = (data: FormValues) => {
    Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/update-preplanning-location", {
      payload: data,
      googleAddress: searchBox?.getPlace() ? searchBox?.getPlace().formatted_address : props.selectedEditLocation.google_formatted_address,
      id: props.selectedEditLocation.id,
    }, {
      withCredentials: true,
    })
      .then((response) => {
        props.setSelectedEditLocaton({
          ...props.selectedEditLocation,
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
          hydrant_distance: Number(data.hydrantDistance),
          mutual_aids: data.mutualAid as string[],
          google_formatted_address: searchBox?.getPlace() ? searchBox.getPlace().formatted_address as string : props.selectedEditLocation.google_formatted_address as string, 
          latitude: props.selectedEditLocation.latitude,
          longitude: props.selectedEditLocation.longitude,
          occupancyaddress: data.occupancyAddress as string,
          occupancycity: data.occupancyCity as string,
          occupancystate: data.state as string,
          occupancyzip: data.zipCode as string,
          occupancycountry: data.country as string,
          water: data.waterLoc as string,
        })

        setLocationEditResponse(response.data);
        props.updateLocations({
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
          hydrant_distance: Number(data.hydrantDistance),
          mutual_aids: data.mutualAid as string[],
          google_formatted_address: searchBox?.getPlace() ? searchBox.getPlace().formatted_address as string : props.selectedEditLocation.google_formatted_address as string, 
          latitude: props.selectedEditLocation.latitude,
          longitude: props.selectedEditLocation.longitude,
          occupancyaddress: data.occupancyAddress as string,
          occupancycity: data.occupancyCity as string,
          occupancystate: data.state as string,
          occupancyzip: data.zipCode as string,
          occupancycountry: data.country as string,
          water: data.waterLoc as string,
        }, props.selectedEditLocation.id as number);
      })
      .catch((error) => {
        setLocationEditResponse(error.response?.data);
      });
  };

  const deleteLocation = async (id: number) => {
  
    try {
      const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/delete-preplanning-location", {
        id: id,
      }, {
        withCredentials: true,
      });
      

      if (response.data.status === "success") {
        props.removeLocation(id);
        props.setSelectedEditLocaton(props.locationInitalizer);
        setDeleteLocationWindow(false);
        alert(response.data.message);
        props.onHide(false);
      } else if (response.data.status === "error") {
        alert(response.data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      } else if (error instanceof AxiosError) {
        console.log(error);
      }
      alert("Any error occured");
    }
  }

  return (
    <>
      <GenericPopupWindow
        show={props.show}
        onHide={() => props.onHide(false)}
        contentClassName="edit-location-modal"
        title="Edit Location"
        onExit={() => {
          setLocationEditResponse({
            status: "",
            message: "",
            err: "",
          });
        }}
        footerClassName="edit-location-footer d-flex justify-content-between"
        extraButton="Delete Location"
        extraButtonVariant="danger"
        extraAction={() => {
          setDeleteLocationWindow(true);
        }}
        closeButtonClassName="close-button"
        extraButtonClassName="delete-button"
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
                    {...register("occupancyAddress", {
                      required: {
                        value: true,
                        message: "Please enter a Street Address",
                      },
                    })}
                    type="text"
                    placeholder="Street Address"
                  />
                  {errors?.occupancyAddress && (
                    <span style={{ color: "red" }}>
                      {errors?.occupancyAddress.message}
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
                    {...register("occupancyCity", {
                      required: { value: true, message: "Please enter a City" },
                    })}
                    style={{ width: "100%" }}
                    type="text"
                    placeholder="City"
                  />
                  {errors?.occupancyCity && (
                    <span style={{ color: "red" }}>{errors?.occupancyCity.message}</span>
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
                    Hazards
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
                    as="textarea"
                    placeholder="Hydrant Address"
                  />
                  {errors?.hydrantAddress && (
                    <span style={{ color: "red" }}>
                      {errors?.hydrantAddress.message}
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
            <Alert variant="error" className="m-2">
                {locationEditResponse?.message}
            </Alert>
          ) : null}
        </Form>
      </GenericPopupWindow>
      {deleteLocationWindow ? (
        <GenericPopupWindow
          show={deleteLocationWindow}
          onHide={() => setDeleteLocationWindow(false)}
          title="Delete Location Confirmation"
          headerClassName='delete-user-header bg-danger text-white'
          extraButton="Delete"
          extraButtonVariant="danger"
          extraAction={() => deleteLocation(props.selectedEditLocation.id as number)}
        >
          <Alert show={deleteLocationWindow} variant='danger'>
              You are about to delete this user. Are you sure you want to continue?
          </Alert>
        </GenericPopupWindow>
      ) : null}
    </>
  );
}

export default React.memo(EditLocation);
