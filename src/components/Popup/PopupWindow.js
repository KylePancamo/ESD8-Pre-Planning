import React from "react";

function PopupWindow(props) {

    return (
        
        <div className="popup">
                {props.markerClicked ? (
                    <div className="popup_inner">
                        <div>
                            <div>
                                Lat:{props.markerLoc.latitude}
                                &nbsp;
                                Lng:{props.markerLoc.longitude}
                            </div>
                        </div>
                        <button onClick={() => props.setMarkerClicked(false)}>close popup</button>
                    </div>
                    ) : null
                }
            </div>
        
    );
}

export default PopupWindow;