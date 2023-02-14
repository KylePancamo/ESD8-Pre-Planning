import { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import { Pencil } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import Popup from "../Popup/GenericPopup"
import Axios from "axios";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import {sideBarDataState} from "../../atoms";
import {siteIsSetState} from "../../atoms";
import EditLocation from "../AdminPanel/ViewLocations/EditLocationModal";
import usePrePlanningLocations from "../../hooks/usePreplanningLocations";

function Sidebar(props) {
  const [siteIsSet, setSiteIsSet] = useRecoilState(siteIsSetState);
  const [searchedSite, setSearchedSite] = useRecoilState(searchSiteState);
  const [sidebarData, setSidebarData] = useRecoilState(sideBarDataState);
  const [editLocation, setEditLocation] = useState(false);
  const [preplanningLocations, updateLocations] = usePrePlanningLocations();

  console.log(sidebarData)

  const updateEdit = useCallback(() => {
    setEditLocation(false);
  })

  

  const toggleSideBar = () => {
    props.setSideBarValue(!props.sideBarValue);
  };

  useEffect(() => {
    if (searchedSite !== "") {
      Axios.post("http://localhost:5000/api/get-sidebar-data", {address: searchedSite})
      .then((response) => {
        console.log(response.data.payload);
        if(response.data.payload.length > 0) {
          setSiteIsSet(true);
          console.log(response.data.payload[0])
          setSidebarData(response.data.payload[0]);
          console.log(response);
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
  }, [searchedSite]);

  return (
    <div className="sidebar-wrapper">
      {props.sideBarValue === false ? (
        <button className="sidebar-button" onClick={toggleSideBar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
            id="sidebar-button"
          >
            <path d="m15.2 43.9-2.8-2.85L29.55 23.9 12.4 6.75l2.8-2.85 20 20Z" />
          </svg>
        </button>
      ) : null}
      {props.sideBarValue === true ? (
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
                <Button 
                  size="sm" 
                  className="sidebar-edit-location"
                  onClick={() => setEditLocation(true)}
                >
                  Edit
                </Button>
                <Header 
                  sidebarData={sidebarData}
                >
                </Header>
                <Content
                  sidebarData={sidebarData}
                >
                </Content>
              </div>
              ) : searchedSite !== "" ? (
                <div style={{position: "relative", top: "50%", left: "25%"}}>
                  <p>Site not found. Please try again.</p>
                </div>
              ) : (
                <div style={{position: "relative", top: "50%", left: "25%"}}>
                  <p>Please search for a site.</p>
                </div>
             )}
        </div>
      ) : null}
      {editLocation ? (
        <EditLocation
          show={editLocation}
          onHide={updateEdit}
          selectedEditLocation={sidebarData}
          setSelectedEditLocaton={setSidebarData}
          updateLocations={updateLocations}
        />
      ) : null}

    </div>
  );
}

export default Sidebar;