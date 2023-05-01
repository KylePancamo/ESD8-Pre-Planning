import React from "react";
import { LocationTypes } from "../../types/location-types";
import { Col, Container, FloatingLabel, Row } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import "../../styles/default.css";

import {TbWorldLatitude, TbWorldLongitude} from 'react-icons/tb';
import { MdOutlineWarning, MdFireHydrantAlt, MdOutlineNotes, MdAccessibilityNew, MdOutlineElectricBolt, MdPower, MdWaterDrop } from 'react-icons/md';

enum OccupancyType {
  "Assembly" = 1,
  "Commercial" = 2,
  "Educational" = 3,
  "Hazardous" = 4,
  "Industrial" = 5,
  "Institutional" = 6,
  "Mercantile" = 7,
  "Residential" = 8,
  "Storage" = 9
}

enum ConstructionType {
  "Fire Resistive" = 1,
  "Non-Combustible" = 2,
  "Ordinary" = 3,
  "Heavy Timber" = 4,
  "Wood Frame" = 5,
  "Light Weight Wood Truss" = 6
}


enum MutualAids {
  "Helotes FD" = 1,
  "District 7 FD" = 2,
  "Leon Springs FD" = 3,
  "District 2 FD" = 4
}
  
function Content({ sidebarData }: { sidebarData: LocationTypes }) {
  console.log(sidebarData);

  let hazardList: JSX.Element[] = [];
  if(sidebarData.hazards != null) {
    const hazards = sidebarData.hazards.split(";");
    hazardList = hazards.map((hazard: any) =>
      <span key={hazard}>{hazard}<br/></span>
    );
  }

  let accessList: JSX.Element[] = [];
  if(sidebarData.access != null) {
    const access = sidebarData.access.split(";");
    accessList = access.map((acc: any) =>
      <span key={acc}>{acc}<br/></span>
    );
  }

  let occupancyList: JSX.Element[] = [];
  if (sidebarData.occupancy_types) {
    occupancyList = sidebarData.occupancy_types.map((occupancy: any) => (
      <span key={occupancy}>
       {OccupancyType[occupancy]} <br/>
      </span>
    ));
  }

  let constructionList: JSX.Element[] = [];
  if (sidebarData.construction_types) {
    constructionList = sidebarData.construction_types.map((construction: any) => (
      <span key={construction}>
      {ConstructionType[construction]} <br/>
      </span>
    ));
  }

  let mutualAidList: JSX.Element[] = [];
  if (sidebarData.mutual_aids) {
    mutualAidList = sidebarData.mutual_aids.map((aid: any) => (
    <span key={aid}>
      {MutualAids[aid]} <br/>
      </span>
    ));
  }

  



  return (
    <div className="sidebar-content break-newline">
      <ListGroup as="ol">
        <Row>
          <Col xs={6} className="d-flex justify-content-center">
            <ListGroup.Item as="li" className="list-group-latlng">
              <Badge bg="none">
                <TbWorldLatitude color="black" size={15}/>
              </Badge>
              {sidebarData.latitude}
            </ListGroup.Item>
          </Col>
          <Col xs={6} className="d-flex justify-content-center">
            <ListGroup.Item as="li" className="list-group-latlng">
              <Badge bg="none">
                <TbWorldLongitude color="black" size={15}/>
              </Badge>
              {sidebarData.longitude}
            </ListGroup.Item>
          </Col>
        </Row>
        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Occupancy Types</div>
            {occupancyList}
          </div>
        </ListGroup.Item>
        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Construction Types</div>
            {constructionList}
          </div>
        </ListGroup.Item>
        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Mutual Aids</div>
            {mutualAidList}
          </div>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Hazards</div>
            {hazardList}
          </div>
          <Badge bg="none">
            <MdOutlineWarning color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Hydrant Location</div>
            {sidebarData.hydrant_address}
          </div>
          <Badge bg="none">
            <MdFireHydrantAlt color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Access</div>
            {accessList}
          </div>
          <Badge bg="none" pill>
            <MdAccessibilityNew color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Notes</div>
            {sidebarData.other_notes}
          </div>
          <Badge bg="none">
            <MdOutlineNotes color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Electric Meter Shutoff</div>
            {sidebarData.electric_meter}
          </div>
          <Badge bg="none">
            <MdOutlineElectricBolt color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Breaker Box Shutoff</div>
            {sidebarData.breaker_box}
          </div>
          <Badge bg="none">
            <MdPower color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
          <div className="ms-2 me-auto">
            <div className="fw-bold">Water Shutoff</div>
            {sidebarData.water}
          </div>
          <Badge bg="none">
            <MdWaterDrop color="black" size={15}/>
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item as="li" className="d-flex justify-content-center align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Emergency Contact</div>
            {sidebarData.emergency_contact_number}
          </div>
          <div className="ms-2">
            <div className="fw-bold">Contact Name</div>
            {sidebarData.contactname}
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default Content;
