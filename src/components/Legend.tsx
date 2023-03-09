import Axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useRecoilState } from "recoil";
import { imagesState } from "../atoms";
import { Image } from "../types/atoms-types";

function LegendItem({ image } : {image: Image}) {
  return (
    <div className="icon-legend-item">
      <img src={"/icon_images/" + image.file_name} className="icon-legend-icon"/>
      <span className="icon-legend-text">{image.icon_name}</span>
    </div>
  )
}

function Legend() {
  const [images, setImages] = useRecoilState<Image[]>(imagesState);
  return (
      <div className="icon-legend">
        <div className="icon-legend-header">
            Legend
        </div>
        <div className="icon-legend-items">
          {images.map((image: any) => {
            return <LegendItem image={image} key={image.icon_id}/>
          })}
        </div>
      </div>
  );
}
export default Legend;
