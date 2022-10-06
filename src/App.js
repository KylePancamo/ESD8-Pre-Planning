import MapContainer from "./MapContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function Sidebar() {
  const [sideBarValue, setSideBarValue] = useState(false);
  const toggleSideBar = () => {
    setSideBarValue(!sideBarValue);
  };

  return (
    <div className="sidebar-wrapper">
      {sideBarValue === false ? (
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
      {sideBarValue === true ? (
        <div class="sidebar-menu" id="sidebar-menu">
          <div className="sidebar-close">
            <button
              class="close-button"
              id="close-button"
              onClick={toggleSideBar}
            >
              X
            </button>
          </div>
          <div class="sidebar-data-wrapper">
            <div class="sidebar-data">Some pre-plan data</div>
            <div class="sidebar-data">Some more pre-plan data</div>
            <div class="sidebar-data">Even more pre-plan data</div>
            <div class="sidebar-data">
              Here's a lot of pre-plan data. Here's a lot of pre-plan data.
              Here's a lot of pre-plan data. Here's a lot of pre-plan data.
              Here's a lot of pre-plan data. Here's a lot of pre-plan data.
              Here's a lot of pre-plan data.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function App() {
  return (
    <div className="webpage">
      <Sidebar />
      <MapContainer />
    </div>
  );
}
export default App;
