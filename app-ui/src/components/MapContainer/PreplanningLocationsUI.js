import usePrePlanningLocations from "../../hooks/usePreplanningLocations";
import {useRecoilState} from 'recoil';
import {searchSiteState} from "../../atoms";

function PreplanningLocationsUI({ setSideBarValue, setCenter }) {
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
                                        setCenter({lat: parseFloat(location.latitude), lng: parseFloat(location.longitude)});
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