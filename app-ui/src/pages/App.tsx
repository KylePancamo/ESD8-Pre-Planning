import MapContainer from "../components/MapContainer/MapContainer";
import Legend from "../components/Legend";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Axios from "axios";
import {useState, useEffect} from "react";
import {useRecoilState} from 'recoil';
import {imagesState, preplanningLocationsState, defaultMarkerIconExistsState} from "../atoms";
import { SearchSite } from "../types/atoms-types";
import React from "react";
import config from "../config/config";

function App() {
  const [sideBarValue, setSideBarValue] = useState(false);
  const [searchedSite, setSearchedSite] = useState<SearchSite>();
  const [images, setImages] = useRecoilState(imagesState);
  const [defaultMarkerIconExist, setDefaultMarkerIconExist] = useRecoilState<boolean>(defaultMarkerIconExistsState);
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState(preplanningLocationsState);
  
  async function setIcons() {
    const uploadedIcons = await Axios.get("http://localhost:5000/api/get-uploaded-icons", {
      withCredentials: true,
    });
    if (!uploadedIcons.data) {
      console.log("No icons found");
    } 
    setImages(uploadedIcons.data);
  }

  async function setLocations() {
    const preplanLocations = await Axios.get("http://localhost:5000/api/get-preplanning-locations", {
      withCredentials: true,
    });
    if (!preplanLocations.data.result) {
      console.log("No preplanning locations found");
    }
    setPrePlanningLocations(preplanLocations.data.result);
  }

  const checkDefaultMarkerIconExists = async () => {
    const response = await Axios.get('http://localhost:5000/api/check-file', {
      params: {
        fileName: config.DEFAULT_MARKER_NAME,
      },
      withCredentials: true,
    }).then((response) => {
      if (response?.data.status === "success") {
        setDefaultMarkerIconExist(true);
      }
    }).catch((error) => {
      console.log(error.message);
    });
  }

  useEffect(() => {
    setIcons();
    setLocations();
    checkDefaultMarkerIconExists();
  }, []);
  
  return (
    <div className="webpage">
      <Sidebar
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
      />
      <MapContainer
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
      />
      <Legend />
    </div>
  );
}
export default App;
