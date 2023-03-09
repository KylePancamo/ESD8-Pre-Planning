import React from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import Form from "react-bootstrap/Form";
import {AiOutlineClose, AiOutlineSearch} from "react-icons/ai";

type MapStandaloneSearchBoxProps = {
  bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | undefined;
  onPlacesChanged: () => void;
  onSBLoad: (ref: google.maps.places.SearchBox) => void;
  clearPlaces: () => void;
  searchBoxRef: React.RefObject<HTMLInputElement>;
};

function MapStandaloneSearchBox({ bounds, onPlacesChanged, onSBLoad, clearPlaces, searchBoxRef } : MapStandaloneSearchBoxProps) {

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (searchBoxRef.current) {
      searchBoxRef.current.value = "";
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
              <button onClick={handleClear}>
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

export default React.memo(MapStandaloneSearchBox);
