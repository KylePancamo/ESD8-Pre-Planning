import React from "react";
import { LocationTypes } from "../../types/location-types"; 

function Header({sidebarData}: {sidebarData: LocationTypes}) {
  let addressLineOne = "";
  let addressLineTwo = "";

  if(sidebarData.occupancyaddress != null) {
    const formattedAddress = sidebarData.occupancyaddress.split(",");
    addressLineOne = formattedAddress[0];
    addressLineTwo = formattedAddress[1] + formattedAddress[2] + formattedAddress[3];
  }
  
  return (
    <div className="sidebar-header">
      <p className="sidebar-header__title">{sidebarData.occupancyname}</p>
      <p className="sidebar-header__subtitle">{addressLineOne}</p>
    </div>
  );
}

export default Header;