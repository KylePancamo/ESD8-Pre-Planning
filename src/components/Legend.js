import Axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function Legend(props) {
    const [edit, setEdit] = useState(false);
    const [legend, setLegend] = useState(false);
    const [legendItems, setLegendItems] = useState([]);
    const [legendItemsLoaded, setLegendItemsLoaded] = useState(false);

    const fetchLegendItems = () => { //will fetch the images from the database
        Axios.get("http://localhost:5000/api/getLegendItems")
            .then((response) => {
                setLegendItems(response.data);
                setLegendItemsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchLegendItems();
    }, []);

    const handleLegend = () => {
        setLegend(!legend);

        if (legend) {
            props.setLegendValue(false);
        } else {
            props.setLegendValue(true);
        }


    }

    return (
        <div className="legend">
            <button className="btn btn-primary" onClick={() => { handleLegend() }}>Legend</button>
            <Modal 
                show={legend}
                onHide={() => {
                    setLegend(false);
                    props.setLegendValue(false);
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Legend
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="legend-items">
                        {legendItemsLoaded ? (
                            legendItems.map((legendItem) => {
                                return (
                                    <div className="legend-item">
                                        <img src={legendItem.icon_url} alt={legendItem.icon_name} />
                                        <p>{legendItem.icon_name}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className = "legend-item">
                                <p>Loading...</p>
                            </div>
                            
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
export default Legend;
