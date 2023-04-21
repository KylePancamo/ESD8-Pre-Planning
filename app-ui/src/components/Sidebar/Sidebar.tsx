import { useState, useEffect, useCallback } from "react";
import React from "react";
import Header from "./Header";
import Content from "./Content";
import { Button } from "react-bootstrap";
import Axios from "axios";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import EditLocation from "../Popup/EditLocationModal";
import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import AddLocationModal from "../Popup/AddLocationModal";

import { useAuth } from "../../hooks/AuthProvider";
import { permission } from "../../permissions";
import { hasPermissions } from '../../helpers';


type SideBarProps = {
  sideBarValue: boolean;
  setSideBarValue: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sidebar({sideBarValue, setSideBarValue} : SideBarProps) {
  const [searchedSite, setSearchedSite] = useRecoilState<any>(searchSiteState);
  const [editLocation, setEditLocation] = useState<boolean>(false);
  const { prePlanningLocations, updateLocations }= usePrePlanningLocations();
  const [addLocationButton, setAddLocationButton] = useState<boolean>(false);
  const { userData } = useAuth();

  

  console.log(searchedSite);

  const updateEdit = useCallback(() => {
    setEditLocation(false);
  }, [])
  
  const toggleSideBar = () => {
    setSideBarValue(!sideBarValue);
  };
  
  const userCanModify = hasPermissions(userData?.permissions as number, permission.MODIFY);

  function renderEditLocationButton() {
    return (
      <Button
        size="sm"
        className="sidebar-edit-location"
        onClick={() => setEditLocation(true)}
      >
        Edit
      </Button>
    );
  }

  function renderEditLocationModal() {
    return (
      <EditLocation
        show={editLocation}
        onHide={updateEdit}
        selectedEditLocation={searchedSite}
        setSelectedEditLocaton={setSearchedSite}
        updateLocations={updateLocations}
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
        <Button className="sidebar-button" onClick={toggleSideBar}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="50" 
            viewBox="0 96 960 960" 
            width="50"
          >
            <path d="M375.333 816 328 768.667l193.334-193.334L328
            382l47.333-47.333L616 575.333
            375.333 816Z"/>
          </svg>
        </Button>
      ) : null}
      {sideBarValue === true ? (
        <div className="sidebar-menu" id="sidebar-menu">
          <div className="sidebar-close">
            <Button
              className="close-button"
              onClick={toggleSideBar}
            >
              X
            </Button>
          </div>
            {searchedSite.id ? (
              <div className="sidebar-data-wrapper">
                {userCanModify && renderEditLocationButton()}
                {editLocation && renderEditLocationModal()}
                <Header 
                  sidebarData={searchedSite}
                />
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
                  <p>Please search for a site.</p>
                </div>
             )}
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;