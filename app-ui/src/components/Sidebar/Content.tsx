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
  



  return (
    <div className="sidebar-content">
      <div className="sidebar__block">
        <div className="sidebar__block-content">
          <div className="sidebar__block-title">Mutual Aid</div>
          <p className="sidebar__block-box" id="mutual-aid">
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
