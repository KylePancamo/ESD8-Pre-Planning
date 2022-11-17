import Axios from "axios";

const fetchPreplanData = (setpreplanData, reset, props) => {
    Axios.get(
      "http://localhost:5000/api/getPreplanningLocation/" +
        props.selectedEditLocation?.id
    )
      .then((response) => {
        setpreplanData(response.data[0]);
        reset({
            occupancyName: response.data[0].occupancyname,
            emergencyContact: response.data[0].emergency_contact_number,
            occupancyType: response.data[0].occupancytype,
            streetAddress: response.data[0].occupancyaddress,
            city: response.data[0].occupancycity,
            state: response.data[0].occupancystate,
            zipCode: response.data[0].occupancyzip,
            electricMeterLoc: response.data[0].electric_meter,
            breakerBoxLoc: response.data[0].breaker_box,
            waterLoc: response.data[0].water,
            gasShutoffLoc: response.data[0].gas_shutoff,
            hydrantAddress: response.data[0].hydrant_address,
            hydrantDistance: response.data[0].hydrant_distance,
            hazards: response.data[0].hazards,
            accessInformation: response.data[0].access,
            notes: response.data[0].other_notes,
            constructionType: response.data[0].constructiontype,
            mutual_aid1: response.data[0].mut_aid_helotesfd,
            mutual_aid2: response.data[0].mut_aid_d7fr,
            mutual_aid3: response.data[0].mut_aid_leonspringsvfd,
            mutual_aid4: response.data[0].mut_aid_bc2fd,
            contactName: response.data[0].contactname,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export default fetchPreplanData;