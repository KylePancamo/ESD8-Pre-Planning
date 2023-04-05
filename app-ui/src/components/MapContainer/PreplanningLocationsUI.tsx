import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";
import React from "react";


type center = google.maps.LatLng | google.maps.LatLngLiteral;

type PreplanningLocationsUIProps = {
    setSideBarValue: React.Dispatch<React.SetStateAction<boolean>>;
    setOccupancyLocation: React.Dispatch<React.SetStateAction<center>>;
    setCenter: React.Dispatch<React.SetStateAction<center>>;

}

function PreplanningLocationsUI({ setSideBarValue, setOccupancyLocation, setCenter } : PreplanningLocationsUIProps) {
    const { prePlanningLocations } = usePrePlanningLocations();
    const [searchedSite, setSearchedSite] = useRecoilState(searchSiteState);

    return (
        
        <div className="preplan-locations">
            <div className="preplan-locations__container">
                <table className="preplan-locations__table">
                    <tbody>
                        {prePlanningLocations.map((location) => {
                            return (
                                <tr key={location.id}>
                                    <td onClick={() => {
                                        setOccupancyLocation({lat: location.latitude, lng: location.longitude});
                                        setCenter({lat: location.latitude, lng: location.longitude})
                                        setSearchedSite({
                                            location: location.google_formatted_address,
                                            latitude: location.latitude,
                                            longitude: location.longitude,
                                        });
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
};

export default PreplanningLocationsUI;