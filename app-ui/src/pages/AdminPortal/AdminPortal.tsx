import "./AdminPortal.css"
import React, { useState } from "react";
import Users from "./Users/Users";
import RoleTypes from "./RoleTypes";
import RegisterUser from "./RegisterUsers";
import LogViewer from "./LogViewer";
import { useAuth } from "../../hooks/AuthProvider";

type portalTypes = {
    [key: string]: JSX.Element
}

function AdminPortal() {
    const { userData } = useAuth();
    const [portalType, setPortalType] = useState<string>('users');
    const portalTypes: portalTypes = {
        "users": <Users />,
        "roleTypes": <RoleTypes />,
        "registerUsers": <RegisterUser />,
        "logs": <LogViewer />,
    }

    const isActive = (type: string) => {
        return portalType === type ? 'active' : '';
    };

    return (
        <div className="admin-background">
            <div className="admin-wrapper">
                <div className="admin-wrapper-leftmemu">
                    <span className="text-center">Admin Portal</span>
                    <div className="sidebar-divider">
                        <ul className="sidebar-nav">
                            <li className={`sidebar-item ${isActive('users')}`} onClick={(e) => {
                                e.preventDefault();
                                setPortalType("users")
                            }}>
                                <span className="sidebar-item-link">Modify Users</span>
                            </li>
                            <li className={`sidebar-item ${isActive('roleTypes')}`} onClick={(e) => {
                                e.preventDefault();
                                setPortalType("roleTypes")
                            }}>
                                <span className="sidebar-item-link">Modify Role Types</span>
                            </li>
                            <li className={`sidebar-item ${isActive('registerUsers')}`} onClick={(e) => {
                                e.preventDefault();
                                setPortalType("registerUsers")
                            }}>
                                <span className="sidebar-item-link">Register Users</span>
                            </li>
                            <li className={`sidebar-item ${isActive('logs')}`} onClick={(e) => {
                                e.preventDefault();
                                setPortalType("logs")
                            }}>
                                <span className="sidebar-item-link">Logs</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="loaded-component">
                    <h1>Welcome, <b><u><i>{userData?.username}</i></u></b></h1>
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
