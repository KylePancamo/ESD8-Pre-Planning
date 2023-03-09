import React from "react";
import { LocationTypes } from "../../types/location-types"; 
  
function Content({ sidebarData }: { sidebarData: LocationTypes }) {
  console.log(sidebarData);

  let hazardList: JSX.Element[] = [];
  if(sidebarData.hazards != null) {
    const hazards = sidebarData.hazards.split(";");
    hazardList = hazards.map((hazard: any) =>
      <span key={hazard}>{hazard}<br/></span>
    );
  }

  let accessList: JSX.Element[] = [];
  if(sidebarData.access != null) {
    const access = sidebarData.access.split(";");
    accessList = access.map((acc: any) =>
      <span key={acc}>{acc}<br/></span>
    );
  }

  let mutualAidList = [];
  if(sidebarData.mut_aid_bc2fd === 1) {
    mutualAidList.push("BC2 FD - Hazmat");
  }
  if(sidebarData.mut_aid_d7fr === 1) {
    mutualAidList.push("D7 Fire & Rescue");
  }
  if(sidebarData.mut_aid_helotesfd === 1) {
    mutualAidList.push("Helotes FD");
  }
  if(sidebarData.mut_aid_leonspringsvfd === 1) {
    mutualAidList.push("Leon Springs VFD");
  }
  mutualAidList = mutualAidList.map((mutAid) =>
    <span key={mutAid}>{mutAid}<br/></span>
  );
  



  return (
    <div className="sidebar__content">
      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">
            Occupancy Type
            <span className="sidebar__block-text" id="occupancy-type">
            {sidebarData.occupancytype}
            </span>
          </div>
          <div className="filler"></div>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">
            Construction Type
            <span className="sidebar__block-text" id="construction-type">
              {sidebarData.constructiontype}
            </span>
          </div>
          <div className="filler"></div>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Mutual Aid</div>
          <p className="sidebar__block-box" id="mutual-aid">
            {mutualAidList}
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Hazards</div>
          <p className="sidebar__block-box" id="hazards">
            {hazardList}
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Hydrant Location</div>
          <p className="sidebar__block-box" id="hydrant-location">
            {sidebarData.hydrant_address} <br/>
            ({sidebarData.hydrant_distance} ft away) <br/>
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Access</div>
          <p className="sidebar__block-box" id="access">
            {accessList}
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Emergency Contact</div>
          <p className="sidebar__block-box" id="emergency-contact">
          {sidebarData.contactname} <br/>
            {sidebarData.emergency_contact_number} <br/>
          </p>
        </div>
      </div>

      <div className="sidebar__content-separator"></div>

      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Notes</div>
          <p className="sidebar__block-box" id="notes">
            {sidebarData.other_notes}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Content;
