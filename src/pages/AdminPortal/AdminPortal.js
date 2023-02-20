import "./AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import UserRoles from "./UserRoles";
import RoleTypes from "./RoleTypes";


function AdminPortal() {

    const [portalType, setPortalType] = useState('update');
    const portalTypes = {
        "userRoles": <UserRoles />,
        "roleTypes": <RoleTypes />
    }

    return (
        <div className="admin-background">
            <div className="admin-wrapper">
                <div className="admin-form-wrapper">
                    <h2>Admin Portal</h2>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setPortalType("userRoles")
                    }}>
                        Modify User Roles
                    </button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setPortalType("roleTypes")
                    }}>
                        Modify Role Types
                    </button>
                </div>
                <div className="loaded-component">
                    <div className="loaded-component-container">
                        {
                            portalTypes[portalType]
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminPortal;