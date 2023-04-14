import { useState, useEffect, useCallback } from "react";
import React from "react";
import Header from "./Header";
import Content from "./Content";
import { Button } from "react-bootstrap";
import Axios from "axios";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import {sideBarDataState} from "../../atoms";
import {siteIsSetState} from "../../atoms";
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
  const [siteIsSet, setSiteIsSet] = useRecoilState(siteIsSetState);
  const [searchedSite, setSearchedSite] = useRecoilState<any>(searchSiteState);
  const [sidebarData, setSidebarData] = useRecoilState<any>(sideBarDataState);
  const [editLocation, setEditLocation] = useState<boolean>(false);
  const { updateLocations }= usePrePlanningLocations();
  const [addLocationButton, setAddLocationButton] = useState<boolean>(false);
  const { userData } = useAuth();

  console.log(searchedSite);

  const updateEdit = useCallback(() => {
    setEditLocation(false);
  }, [])
  
  const toggleSideBar = () => {
    setSideBarValue(!sideBarValue);
  };
  
  const canEditLocation = hasPermissions(userData?.permissions as number, permission.MODIFY);

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
    console.log(sidebarData);
    return (
      <EditLocation
        show={editLocation}
        onHide={updateEdit}
        selectedEditLocation={sidebarData}
        setSelectedEditLocaton={setSidebarData}
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

  useEffect(() => {
    if (searchedSite.location !== "") {
      Axios.post(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/get-sidebar-data", {address: searchedSite.location}, {withCredentials: true})
      .then((response) => {
        if(response.data.payload.length > 0) {
          setSiteIsSet(true);
          setSidebarData(response.data.payload[0]);
        } else {
          setSiteIsSet(false);
          setSidebarData([]);
        }
      })
      .catch((error) => {
        setSiteIsSet(false);
        console.log(error);
      });
    }
  }, [searchedSite.location]);

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
            <button
              className="close-button"
              id="close-button"
              onClick={toggleSideBar}
            >
              X
            </button>
          </div>
            {siteIsSet ? (
              <div className="sidebar-data-wrapper">
                {canEditLocation && renderEditLocationButton()}
                {editLocation && renderEditLocationModal()}
                <Header 
                  sidebarData={sidebarData}
                />
                <Content
                  sidebarData={sidebarData}
                />
              </div>
              ) : searchedSite.location ? (
                <div style={{
                  width: "fit-content",
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}>
                  <p style={{
                    textAlign: "center",
                    marginBottom: "10px"
                    
                  }}><b>{searchedSite.location}</b> <br/> not found in the database. Please search a different site or add the site.</p>
                  {canEditLocation && renderAddLocationButton()}
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