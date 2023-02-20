import "./AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function RoleTypes() {

    return (
      <div className='role-types-container'>
        <h2>Role Types</h2>
      </div>
    ); 
}

export default RoleTypes;