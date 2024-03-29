import MapContainer from "../components/MapContainer/MapContainer";

import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Axios from "axios";
import {useState, useEffect} from "react";
import {useRecoilState} from 'recoil';
import {imagesState, preplanningLocationsState, defaultMarkerIconExistsState} from "../atoms";
import { useAuth } from "../hooks/AuthProvider";
import config from "../config/config";

function App() {
  const { userData } = useAuth();
  const [sideBarValue, setSideBarValue] = useState(false);
  const [images, setImages] = useRecoilState(imagesState);
  const [defaultMarkerIconExist, setDefaultMarkerIconExist] = useRecoilState<boolean>(defaultMarkerIconExistsState);
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState(preplanningLocationsState);
  
  async function setIcons(signal: AbortSignal) {
    const uploadedIcons = await Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/get-uploaded-icons", {
      withCredentials: true,
      signal: signal,
    });
    if (!uploadedIcons.data) {
      console.log("No icons found");
      return;
    }
    
    setImages(uploadedIcons.data);
  }

  async function setLocations(signal: AbortSignal) {
    const preplanLocations = await Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/get-preplanning-locations", {
      withCredentials: true,
      signal: signal,
    });
    if (!preplanLocations.data.result) {
      console.log("No preplanning locations found");
      return;
    }

    setPrePlanningLocations(preplanLocations.data.result);
  }

  const checkDefaultMarkerIconExists = async (signal: AbortSignal) => {
    const response = await Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/check-file", {
      params: {
        fileName: config.DEFAULT_MARKER_NAME,
      },
      withCredentials: true,
      signal: signal,
    })
    
    if (!response.data) {
      console.log("No default marker icon found")
      return;
    }

    setDefaultMarkerIconExist(true);
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
      <div style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        top: "0px",
        left: "20%",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        padding: "5px",
        borderRadius: "0px 0px 10px 10px",
        color: "black",
      }}>
        <strong>Welcome, {userData?.username}</strong>
      </div>
    </div>
  );
}
export default App;
