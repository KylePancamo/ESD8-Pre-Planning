import MapContainer from "./MapContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar/Sidebar";
import FileUpload from "./components/Popup/FileUploads";
import {useState} from "react";

function App() {
  const [sideBarValue, setSideBarValue] = useState(false);
  const [searchedSite, setSearchedSite] = useState("");
  
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
      <FileUpload />
    </div>
  );
}
export default App;
