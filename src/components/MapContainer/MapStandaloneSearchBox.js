import React from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import Form from "react-bootstrap/Form";
import {AiOutlineClose, AiOutlineSearch} from "react-icons/ai";

function MapStandaloneSearchBox({ bounds, onPlacesChanged, onSBLoad, clearPlaces }) {
  const searchBoxRef = React.useRef(null);

  return (
    <StandaloneSearchBox
      bounds={bounds}
      onPlacesChanged={onPlacesChanged}
      onLoad={onSBLoad}
      
    >
        <div className="search">
          <div className="searchInputs">
            <div className="searchIcon">
              <button onClick={() => {
                searchBoxRef.current.value = "";
                clearPlaces();
              }}>
                <AiOutlineClose/>
              </button>
            </div>
            <Form.Control
              type="text"
              placeholder="Search for a location"
              ref={searchBoxRef}
            />
            <div className="searchIcon">
              <button 
                style={{backgroundColor: "white", fontSize: "20px"}} >
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        </div>
      
    </StandaloneSearchBox>
  );
}

export default MapStandaloneSearchBox;
