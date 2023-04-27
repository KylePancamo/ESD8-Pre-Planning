import { marker } from "../../types/marker-types";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type center = google.maps.LatLng | google.maps.LatLngLiteral;

type PlacedMarkersUIProps = {
    markers: marker[];
    setCenter: React.Dispatch<React.SetStateAction<center>>;
}

function PlacedMarkersUI({ markers, setCenter } : PlacedMarkersUIProps) {
    return (
        <div className="marker-list-ui">
            <div className="marker-list-ui__container">
                <table className="marker-list-ui__table">
                    <tbody>
                        {markers?.map((marker) => {
                            return (
                                <OverlayTrigger
                                    placement={"right"}
                                    overlay={
                                    <Tooltip>
                                        <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
                                            <div>
                                                <h6>Latitude</h6>
                                                <strong>{marker.latitude} </strong>
                                            </div>
                                            <div>
                                                <h6>Longitude</h6>
                                                <strong>{marker.longitude}</strong>
                                            </div>
                                        </div>
                                    </Tooltip>
                                }
                                >
                                <tr key={marker.marker_id}>
                                    <td onClick={() => {
                                        setCenter({lat: marker.latitude, lng: marker.longitude})

                                    }} 
                                    className="marker-list-ui__table-cell">
                                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            <div>
                                                <img src={"/icon_images/" + marker.file_name}/>
                                            </div>
                                            <div>
                                                <strong>{marker.marker_name}</strong>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                </OverlayTrigger>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlacedMarkersUI;