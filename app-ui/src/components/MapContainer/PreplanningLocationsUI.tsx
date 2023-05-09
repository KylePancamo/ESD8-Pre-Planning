import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import { useState, useMemo } from "react";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import React from "react";
import { Form, FloatingLabel } from "react-bootstrap";


type center = google.maps.LatLng | google.maps.LatLngLiteral;

type PreplanningLocationsUIProps = {
    setSideBarValue: React.Dispatch<React.SetStateAction<boolean>>;
    setOccupancyLocation: React.Dispatch<React.SetStateAction<center>>;
    setCenter: React.Dispatch<React.SetStateAction<center>>;

}

function PreplanningLocationsUI({ setSideBarValue, setOccupancyLocation, setCenter } : PreplanningLocationsUIProps) {
    const { prePlanningLocations } = usePrePlanningLocations();
    const [searchedSite, setSearchedSite] = useRecoilState(searchSiteState);
    const [searchTerm, setSearchTerm] = useState<string>('');


    const filteredLocations = useMemo(() => 
        prePlanningLocations?.filter((location) =>
          location.occupancyname.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm, prePlanningLocations]
    );

    return (
        <div className="preplan-locations">
            <div className="preplan-locations__container">
               
                <table className="preplan-locations__table">
                    <tbody>
                    {prePlanningLocations?.length !== 0 ? (
                        <>
                            <div className='search-locations-container'>
                                <FloatingLabel label="Search Locations">
                                    <Form.Control
                                        type='text'
                                        placeholder="Search Locations" 
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                        }}
                                    />
                                </FloatingLabel>
                            </div>
                        </>
                ) : null}
                        {filteredLocations?.map((location) => {
                            return (
                                <tr key={location.id}>
                                    <td onClick={() => {
                                        setOccupancyLocation({lat: location.latitude, lng: location.longitude});
                                        setCenter({lat: location.latitude, lng: location.longitude})
                                        setSearchedSite(location);
                                        setSideBarValue(true);
                                    }} 
                                    className="preplan-locations__table-cell">{location.occupancyname}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default React.memo(PreplanningLocationsUI);