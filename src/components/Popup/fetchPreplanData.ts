import Axios from "axios";
import { UseFormReset } from "react-hook-form";

const fetchPreplanData = (reset: UseFormReset<any>, id: number) => {
  if (!id || id === 0) {
    return;
  }

  Axios.get("http://localhost:5000/api/get-preplanning-locations/" + id)
    .then((response) => {
      try {
        reset({
          occupancyName: response.data.result[0].occupancyname,
          emergencyContact: response.data.result[0].emergency_contact_number,
          occupancyType: response.data.result[0].occupancytype,
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
          constructionType: response.data.result[0].constructiontype,
          mutual_aid1: response.data.result[0].mut_aid_helotesfd,
          mutual_aid2: response.data.result[0].mut_aid_d7fr,
          mutual_aid3: response.data.result[0].mut_aid_leonspringsvfd,
          mutual_aid4: response.data.result[0].mut_aid_bc2fd,
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