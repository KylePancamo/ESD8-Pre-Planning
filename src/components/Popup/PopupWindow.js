import React from "react";

function PopupWindow(props) {

    return (
        
        <div className="popup">
            {console.log(props)}
                {props.markerClicked ? (
                    <div className="popup_inner">
                        <div>
                            {
                                props.markerLoc.position ? (
                                    <div>
                                    Lat:{props.markerLoc.position.lat}
                                    &nbsp;
                                    Lng:{props.markerLoc.position.lng}
                                    </div>
                                ) : null
                            }
                            
                        </div>
                        <button onClick={() => props.setMarkerClicked(false)}>close popup</button>
                    </div>
                    ) : null
                }
            </div>
        
    );
}

export default PopupWindow;