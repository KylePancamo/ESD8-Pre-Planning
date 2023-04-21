import Axios from "axios";
import { UseFormReset } from "react-hook-form";

const fetchPreplanData = (reset: UseFormReset<any>, id: number) => {
  if (!id || id === 0) {
    return;
  }

  Axios.get(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/get-preplanning-locations/" + id)
    .then((response) => {
      try {
        reset({
          occupancyName: response.data.result[0].occupancyname,
          emergencyContact: response.data.result[0].emergency_contact_number,
          occupancyType: response.data.result[0].occupancy_types,
          streetAddress: response.data.result[0].occupancyaddress,
          city: response.data.result[0].occupancycity,
          state: response.data.result[0].occupancystate,
          zipCode: response.data.result[0].occupancyzip,
          electricMeterLoc: response.data.result[0].electric_meter,
          breakerBoxLoc: response.data.result[0].breaker_box,
          waterLoc: response.data.result[0].water,
          gasShutoffLoc: response.data.result[0].gas_shutoff,
          hydrantAddress: response.data.result[0].hydrant_address,
          hydrantDistance: response.data.result[0].hydrant_distance,
          hazards: response.data.result[0].hazards,
          accessInformation: response.data.result[0].access,
          notes: response.data.result[0].other_notes,
          constructionType: response.data.result[0].construction_types,
          mutualAid: response.data.result[0].mutual_aids,
          contactName: response.data.result[0].contactname,
        });
      } catch (err: any) {
        console.log(err.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export default fetchPreplanData;