import "./AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { permission } from "../../permissions"
import { hasPermissions } from "../../helpers"

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'

function RoleTypes() {
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      const response = await Axios.get("http://localhost:5000/api/get-role-permissions");
      console.log(response.data.payload);
      setRolePermissions(response.data.payload);
    }

    fetchRolePermissions();
  }, [])

  const handlePermissionChange = (e, role) => {
    const isChecked = e.target.checked;
    const permissionValue = e.target.value;
    let newPermissioons = role.combined_permissions;

    if (isChecked) {
      newPermissioons |= permissionValue;
    } else {
      newPermissioons &= ~permissionValue;
    }

    setRolePermissions((prevRolePermissions) => {
      return prevRolePermissions.map((currRole) =>
        currRole.id === role.id ? { ...currRole, combined_permissions: newPermissioons } : currRole
      );
    })
  }

  useEffect(() => {
    console.log(rolePermissions)
  }, [rolePermissions])

  return (
    <div className='role-types-container'>
      <h2>Role Types</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((role) => (
              <tr>
                <td>{role.name}</td>
                <td>
                  <DropdownButton id="dropdown-item-button" title="Roles">
                    {Object.entries(permission).map(([key, value]) => (
                      <Dropdown.ItemText>
                        {role.name === "admin" ? (
                            <Form.Check
                              key={key}
                              type="checkbox"
                              label={key}
                              value={value}
                              defaultChecked={hasPermissions(role.combined_permissions, permission[key])}
                              disabled={true}
                            />
                          ) : (
                            <Form.Check
                              key={key}
                              type="checkbox"
                              label={key}
                              value={value}
                              defaultChecked={hasPermissions(role.combined_permissions, permission[key])}
                              onChange={(e) => {
                                handlePermissionChange(e, role);
                              }}
                            />
                          )}
                      </Dropdown.ItemText>
                    ))}
                  </DropdownButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ); 
}

export default RoleTypes;