import MapContainer from "./MapContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar/Sidebar";
import {useState} from "react";

function App() {
  const [sideBarValue, setSideBarValue] = useState(false);
  
  return (
    <div className="webpage">
      <Sidebar
        sideBarValue={sideBarValue}
        setSideBarValue={setSideBarValue}
      />
      <MapContainer
        setSideBarValue={setSideBarValue}
      />
    </div>
  );
}
export default App;
