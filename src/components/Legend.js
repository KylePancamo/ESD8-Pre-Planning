import Axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useRecoilState } from "recoil";
import { imagesState } from "../atoms";

function Legend(props) {
  const [edit, setEdit] = useState(false);
  const [legend, setLegend] = useState(false);
  const [images, setImages] = useRecoilState(imagesState);
  const [legendItemsLoaded, setLegendItemsLoaded] = useState(false);

  return (
    <div className="legend">
      <center><h2>Legend</h2></center>
      <div className="legend-images">
        {images.map((image) => {
          return (
            <div className="legend-item" key={image.icon_id}>
              <img src={"/icon_images/" + image.file_name} />
              {image.icon_name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Legend;
