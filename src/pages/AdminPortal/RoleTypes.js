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
  const updatePermissions = (role, newPermissions) => {
    setRolePermissions((prevRolePermissions) => {
      return prevRolePermissions.map((currRole) =>
        currRole.id === role.id ? { ...currRole, combined_permissions: newPermissions } : currRole
      );
    })
  }

  useEffect(() => {
    const fetchRolePermissions = async () => {
      const response = await Axios.get("http://localhost:5000/api/get-role-permissions");
      console.log(response.data.payload);
      setRolePermissions(response.data.payload);
    }

    fetchRolePermissions();
  }, [])

  const handlePermissionChange = async (e, role) => {
    const isChecked = e.target.checked;
    const permissionValue = e.target.value;
    let newPermissions = role.combined_permissions;

    if (isChecked) {
      newPermissions |= permissionValue;
    } else {
      newPermissions &= ~permissionValue;
    }

    const addedPermissions = newPermissions & ~role.combined_permissions;
    const removedPermissions = ~newPermissions & role.combined_permissions;

    if (addedPermissions) {
      const response = await Axios.post('http://localhost:5000/api/insert-role-permissions', {role, addedPermissions});
      if (response.data.status === 'success') {
        updatePermissions(role, newPermissions);
      }
    } else if (removedPermissions) {
      const response = await Axios.post('http://localhost:5000/api/delete-role-permissions', {role, removedPermissions});
      if (response.data.status === 'success') {
        updatePermissions(role, newPermissions);
      }
    }
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