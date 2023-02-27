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
                <div className="admin-wrapper-leftmemu">
                    <span className="text-center">Admin Portal</span>
                    <div className="sidebar-divider">
                        <ul className="sidebar-nav">
                            <li className="sidebar-item" onClick={(e) => {
                                e.preventDefault();
                                setPortalType("userRoles")
                            }}>
                                <span className="sidebar-item-link">Modify User Roles</span>
                            </li>
                            <li className="sidebar-item" onClick={(e) => {
                                e.preventDefault();
                                setPortalType("roleTypes")
                            }}>
                                <span className="sidebar-item-link">Modify Role Types</span>
                            </li>
                        </ul>
                    </div>
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