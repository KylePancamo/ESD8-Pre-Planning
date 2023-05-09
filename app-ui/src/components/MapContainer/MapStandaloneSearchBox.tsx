import React from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import Form from "react-bootstrap/Form";
import {AiOutlineClose, AiOutlineSearch} from "react-icons/ai";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


type MapStandaloneSearchBoxProps = {
  bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | undefined;
  onPlacesChanged: () => void;
  onSBLoad: (ref: google.maps.places.SearchBox) => void;
  clearPlaces: () => void;
  searchBoxRef: React.RefObject<HTMLInputElement>;
};

function MapStandaloneSearchBox({ bounds, onPlacesChanged, onSBLoad, clearPlaces, searchBoxRef } : MapStandaloneSearchBoxProps) {

  // clears the searchbox sidebar.
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (searchBoxRef.current) {
      searchBoxRef.current.value = ""
    }
    clearPlaces();
  };

  return (
    <StandaloneSearchBox
      bounds={bounds}
      onPlacesChanged={onPlacesChanged}
      onLoad={onSBLoad}
    >
        <div className="search">
          <div className="searchInputs">
            <div className="searchIcon">
              <OverlayTrigger
                placement={"left"}
                overlay={
                  <Tooltip id="tooltip-bottom">
                    Clear Search
                  </Tooltip>
                }
              >
                <button onClick={handleClear} style={{ borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px"}}>
                  <AiOutlineClose/>
                </button>
              </OverlayTrigger> 
            </div>
            <Form.Control
              type="text"
              placeholder="Search for a location"
              ref={searchBoxRef}
              className="autocomplete-input"
            />
            <div className="searchIcon">
              <button 
                style={{backgroundColor: "white", fontSize: "20px", borderTopRightRadius: "20px", borderBottomRightRadius: "20px"}}
              >
                <AiOutlineSearch />
              </button>
            </div>
          </div>
        </div>
      
    </StandaloneSearchBox>
  );
}

export default React.memo(MapStandaloneSearchBox);
