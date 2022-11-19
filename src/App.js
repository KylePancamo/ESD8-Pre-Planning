import MapContainer from "./MapContainer";
import Legend from "./components/Legend";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar/Sidebar";
import FileUpload from "./components/Popup/FileUploads";
import {useState} from "react";

import {
  RecoilRoot,
} from 'recoil';

function App() {
  const [sideBarValue, setSideBarValue] = useState(false);
  const [searchedSite, setSearchedSite] = useState("");
  
  return (
    <div className="webpage">
      <RecoilRoot>
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
        <Legend />
      </RecoilRoot>
    </div>
  );
}
export default App;
