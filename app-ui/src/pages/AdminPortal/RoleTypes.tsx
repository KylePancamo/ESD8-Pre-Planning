import "./AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { permission } from "../../permissions"
import { hasPermissions } from "../../helpers"
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import NewRoleComponent from "./NewRoleComponent";
import Button from 'react-bootstrap/Button'

type RolePermission = {
  id: number,
  name: string,
  combined_permissions: number
}

type UpdateStatus = {
  text: string,
  statusType: string,
  status: boolean | undefined
}

function RoleTypes() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({text: '', statusType: '', status: undefined});  
  
  const updatePermissions = (role: RolePermission, newPermissions: number) => {
    setRolePermissions((prevRolePermissions) => {
      return prevRolePermissions.map((currRole) =>
        currRole.id === role.id ? { ...currRole, combined_permissions: newPermissions } : currRole
      );
    })
  }

  useEffect(() => {
    const fetchRolePermissions = async () => {
      const response = await Axios.get("http://localhost:5000/api/get-role-permissions", {withCredentials: true});
      console.log(response.data.payload);
      setRolePermissions(response.data.payload);
    }

    fetchRolePermissions();
  }, [])

  const handlePermissionChange = async (e: React.ChangeEvent<HTMLInputElement>, role: RolePermission, key: string) => {
    const isChecked = e.target.checked;
    const permissionValue: number = parseInt(e.target.value);
    let newPermissions = role.combined_permissions;

    if (isChecked) {
      newPermissions |= permissionValue;
    } else {
      newPermissions &= ~permissionValue;
    }

    const addedPermissions = newPermissions & ~role.combined_permissions;
    const removedPermissions = ~newPermissions & role.combined_permissions;

    if (addedPermissions) {
      const response = await Axios.post('http://localhost:5000/api/insert-role-permissions', {role, addedPermissions, key}, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        updatePermissions(role, newPermissions);
        setUpdateStatus({
          text: 'Successfully added ' + key + ' permission to ' + role.name, 
          statusType: 'added',
          status: true
        })
      } else {
        setUpdateStatus({
          text: 'Error adding ' + key + ' permissions to ' + role.name,
          statusType: 'added',
          status: false
        })
      }
    } else if (removedPermissions) {
      const response = await Axios.post('http://localhost:5000/api/delete-role-permissions', {role, removedPermissions}, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        updatePermissions(role, newPermissions);
        setUpdateStatus({text: 
          'Successfully removed ' + key + ' permission: ' + role.name,
          statusType: 'removed',
          status: true
        })
      } else {
        setUpdateStatus({
          text: 'Error adding ' + key + ' permissions to ' + role.name,
          statusType: 'removed',
          status: false
      })
      }
    }
  }

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = useMemo(
    () =>
      rolePermissions.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [rolePermissions, searchTerm]
  );

  return (
    <>
      <div className='role-types-container'>
        <h2>Role Types</h2>
        <div className='search-container'>
                <input
                  type='text'
                  placeholder='Search users'
                  value={searchTerm}
                  onChange={(e) => {
                      setSearchTerm(e.target.value)
                  }}
                />
              </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Permissions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>
                    <DropdownButton id="dropdown-item-button" title="Permissions">
                      {Object.entries(permission).map(([key, value]) => (
                        <Dropdown.ItemText key={value}>
                          {role.name === "admin" ? (
                              <Form.Check
                                key={key}
                                type="checkbox"
                                label={key}
                                value={value}
                                defaultChecked={hasPermissions(role.combined_permissions, value)}
                                disabled={true}
                              />
                            ) : (
                              <Form.Check
                                key={key}
                                type="checkbox"
                                label={key}
                                value={value}
                                defaultChecked={hasPermissions(role.combined_permissions, value)}
                                onChange={(e) => {
                                  handlePermissionChange(e, role, key);
                                }}
                              />
                            )}
                        </Dropdown.ItemText>
                      ))}
                    </DropdownButton>
                  </td>
                  <td>
                    <Button variant="danger">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {updateStatus.status === true ? (
            <Alert variant="success" className="m-2">
              {updateStatus.text}
            </Alert>
          ) : updateStatus.status === false ? (
            <Alert variant="danger" className="m-2">
              {updateStatus.text}
            </Alert>
          ) : null}
        </div>
      </div>
      <NewRoleComponent
        setRolePermissions={setRolePermissions}
      />
    </>
  ); 
}

export default RoleTypes;