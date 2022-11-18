import Axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function Legend(props) {
  const [edit, setEdit] = useState(false);
  const [legend, setLegend] = useState(false);
  const [legendItems, setLegendItems] = useState([]);
  const [legendItemsLoaded, setLegendItemsLoaded] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:5000/api/getIcons")
      .then((response) => {
        setLegendItems(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="legend">
      <div className="legend-images">
        {legendItems.map((image) => {
          return (
            <div className="legend-item">
              <img src={"/images/" + image.file_name} />
              {image.icon_name}
            </div>
           
          );
        })}
      </div>
    </div>
  );
}
export default Legend;
