import { useState, useCallback } from "react";
import React from "react";
import Header from "./Header";
import Content from "./Content";
import { Button } from "react-bootstrap";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import EditLocation from "../Popup/EditLocationModal";
import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import AddLocationModal from "../Popup/AddLocationModal";
import { useAuth } from "../../hooks/AuthProvider";
import { permission } from "../../permissions";
import { hasPermissions } from '../../helpers';
import { LocationTypes } from "../../types/location-types";



type SideBarProps = {
  sideBarValue: boolean;
  setSideBarValue: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({sideBarValue, setSideBarValue} : SideBarProps) {
  const [searchedSite, setSearchedSite] = useRecoilState<LocationTypes>(searchSiteState);
  const [editLocation, setEditLocation] = useState<boolean>(false);
  const { updateLocations, removeLocation, locationInitalizer }= usePrePlanningLocations();
  const [addLocationButton, setAddLocationButton] = useState<boolean>(false);
  const { userData } = useAuth();

  const updateEdit = useCallback(() => {
    setEditLocation(false);
  }, [])
  
  const toggleSideBar = () => {
    setSideBarValue(!sideBarValue);
  };
  
  const userCanModify = hasPermissions(userData?.permissions as number, permission.MODIFY);

  function renderEditLocationModal() {
    return (
      <EditLocation
        show={editLocation}
        onHide={updateEdit}
        selectedEditLocation={searchedSite}
        setSelectedEditLocaton={setSearchedSite}
        updateLocations={updateLocations}
        removeLocation={removeLocation}
        locationInitalizer={locationInitalizer}
      />
    );
  }

  function renderAddLocationButton() {
    return (
      <Button onClick={() => setAddLocationButton(true) }>
        Add Site
      </Button>
    );
  }

  function renderAddLocationModal() {
    return (
      <AddLocationModal
        show={addLocationButton}
        onHide={() => setAddLocationButton(false)}
        address={searchedSite}
      />
    );
  }

  return (
    <div className="sidebar-wrapper">
      {sideBarValue === false ? (
        <Button className="sidebar-button" variant="secondary" onClick={toggleSideBar}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="50" 
            viewBox="0 96 960 960" 
            width="50"
            style={{
              fill: "white"
            }}
          >
            <path d="M375.333 816 328 768.667l193.334-193.334L328
            382l47.333-47.333L616 575.333
            375.333 816Z"/>
          </svg>
        </Button>
      ) : null}
      {sideBarValue === true ? (
        <div className="sidebar-menu" id="sidebar-menu">
           <Header 
              sidebarData={searchedSite}
              toggleSideBar={toggleSideBar}
              userData={userData}
              setEditLocation={setEditLocation}
            />
            {searchedSite.id ? (
              <div className="sidebar-data-wrapper">
                {editLocation && renderEditLocationModal()}
               
                <Content
                  sidebarData={searchedSite}
                />
              </div>
              ) : searchedSite.google_formatted_address ? (
                <div style={{
                  width: "fit-content",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}>
                  <p style={{
                    textAlign: "center",
                    marginBottom: "10px"
                    
                  }}><b>{searchedSite.google_formatted_address}</b> <br/> not found in the database. Please search a different site or add the site.</p>
                  {userCanModify && renderAddLocationButton()}
                  {addLocationButton && renderAddLocationModal()}
                </div>
              ) : (
                <div style={{position: "relative", top: "50%", left: "25%"}}>
                  <p>Search for a site to add a new location</p>
                </div>
             )}
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;