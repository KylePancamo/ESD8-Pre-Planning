import "./AdminPortal.css"
import React, { useState } from "react";
import UserRoles from "./UserRoles";
import RoleTypes from "./RoleTypes";
import RegisterUser from "./RegisterUsers";

type portalTypes = {
    [key: string]: JSX.Element
}

function AdminPortal() {

    const [portalType, setPortalType] = useState<string>('update');
    const portalTypes: portalTypes = {
        "userRoles": <UserRoles />,
        "roleTypes": <RoleTypes />,
        "registerUsers": <RegisterUser />
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
                            <li className="sidebar-item" onClick={(e) => {
                                e.preventDefault();
                                setPortalType("registerUsers")
                            }}>
                                <span className="sidebar-item-link">Register Users</span>
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
