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
  
  async function setIcons(signal: AbortSignal) {
    const uploadedIcons = await Axios.get(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/get-uploaded-icons", {
      withCredentials: true,
      signal: signal,
    });
    if (!uploadedIcons.data) {
      console.log("No icons found");
    } 
    setImages(uploadedIcons.data);
  }

  async function setLocations(signal: AbortSignal) {
    const preplanLocations = await Axios.get(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/get-preplanning-locations", {
      withCredentials: true,
      signal: signal,
    });
    if (!preplanLocations.data.result) {
      console.log("No preplanning locations found");
    }
    setPrePlanningLocations(preplanLocations.data.result);
  }

  const checkDefaultMarkerIconExists = async (signal: AbortSignal) => {
    const response = await Axios.get(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/check-file", {
      params: {
        fileName: config.DEFAULT_MARKER_NAME,
      },
      withCredentials: true,
      signal: signal,
    }).then((response) => {
      if (response?.data.status === "success") {
        setDefaultMarkerIconExist(true);
      }
    }).catch((error) => {
      console.log(error.message);
    });
  }

  useEffect(() => {
    const controller = new AbortController();
    setIcons(controller.signal);
    setLocations(controller.signal);
    checkDefaultMarkerIconExists(controller.signal);

    return () => {
      controller.abort();
    }
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
