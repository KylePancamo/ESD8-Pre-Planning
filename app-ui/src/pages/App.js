import MapContainer from "../components/MapContainer/MapContainer";
import Legend from "../components/Legend";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar/Sidebar";
import IconUpload from "../components/Popup/IconUpload";
import Axios from "axios";
import {useState, useEffect} from "react";
import {useRecoilState} from 'recoil';
import {imagesState, preplanningLocationsState} from "../atoms";

function App() {
  const [sideBarValue, setSideBarValue] = useState(false);
  const [searchedSite, setSearchedSite] = useState("");
  const [images, setImages] = useRecoilState(imagesState);
  const [prePlanningLocations, setPrePlanningLocations] = useRecoilState(preplanningLocationsState);
  
  async function setIcons() {
    const uploadedIcons = await Axios.get("http://localhost:5000/api/get-uploaded-icons");
    if (!uploadedIcons.data) {
      console.log("No icons found");
    } 
    setImages(uploadedIcons.data);
  }

  async function setLocations() {
    const preplanLocations = await Axios.get("http://localhost:5000/api/get-preplanning-locations");
    if (!preplanLocations.data.result) {
      console.log("No preplanning locations found");
    }
    setPrePlanningLocations(preplanLocations.data.result);
  }

  useEffect(() => {
    setIcons();
    setLocations();
  }, []);
  
  return (
    <div className="webpage">
      <Sidebar
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
        searchedSite={searchedSite}
        setSearchedSite={setSearchedSite}
      />
      <MapContainer
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
        searchedSite={searchedSite}
        setSearchedSite={setSearchedSite}
      />
      <IconUpload />
      <Legend />
    </div>
  );
}
export default App;
