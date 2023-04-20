import React from "react";
import { LocationTypes } from "../../types/location-types"; 

function Header({sidebarData}: {sidebarData: LocationTypes}) {
  let addressLineOne: string = "";

  if(sidebarData.occupancyaddress != null) {
    addressLineOne = sidebarData.google_formatted_address;
  }
  
  return (
    <>
      <div className="sidebar-header">
        <div>
          <p className="sidebar-header__title">{sidebarData.occupancyname}</p>
          <p className="sidebar-header__subtitle">{addressLineOne}</p>
        </div>
        <div className="sidebar-header-left">
          <p>Occupancy - {sidebarData.occupancytype}</p>
          <p>Fire Resistive, Wood Frame, sidebar-header-leftsidebar-header-left</p>
        </div>
      </div>
      <div className="sidebar-header-bottom"/>
    </>
  );
}

export default Header;