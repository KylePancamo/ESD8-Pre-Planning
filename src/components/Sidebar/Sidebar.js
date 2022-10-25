import { useState } from "react";
import Header from "./Header";
import Content from "./Content";
import EditableContent from "./EditableContent";
import Footer from "./Footer";
import { Pencil } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import Popup from "../Popup/GenericPopup"

function Sidebar(props) {
  const [edit, setEdit] = useState(false);
  const toggleSideBar = () => {
    props.setSideBarValue(!props.sideBarValue);
  };

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
          <Button
            size="sm"
            onClick={() => { 
              setEdit(true);
            }}
          >
            <div className="edit-menu-button">
              <Pencil />
              Edit
            </div>
          </Button>

          <div className="sidebar-close">
            <button
              class="close-button"
              id="close-button"
              onClick={toggleSideBar}
            >
              X
            </button>
          </div>
          <div className="sidebar-data-wrapper">
            <Header />
            <Content/>
            <Footer />
          </div>
        </div>
      ) : null}
      <Popup 
        show={edit}
        onHide={() => {
          setEdit(false);
        }}
      >
        <EditableContent/>
      </Popup>
    </div>
  );
}

export default Sidebar;