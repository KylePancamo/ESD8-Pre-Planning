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
import GenericModal from "../../components/Popup/GenericPopup";

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
  const [roleDeleteWindow, setRoleDeleteWindow] = useState<boolean>(false);
  const [role , setRole] = useState<RolePermission | undefined>(undefined);
  
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchRolePermissions = async () => {
      const response = await Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/get-role-permissions", {
        withCredentials: true,
        signal: controller.signal
      });

      setRolePermissions(response.data.payload);
    }
    
    fetchRolePermissions();

    return () => {
      controller.abort();
    }
  }, [])

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = useMemo(
    () =>
      rolePermissions.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [rolePermissions, searchTerm]
  );
  

  const updatePermissions = (role: RolePermission, newPermissions: number) => {
    setRolePermissions((prevRolePermissions) => {
      return prevRolePermissions.map((currRole) =>
        currRole.id === role.id ? { ...currRole, combined_permissions: newPermissions } : currRole
      );
    })
  }
  
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
      const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/insert-role-permissions", {role, addedPermissions, key}, {
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
      const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/delete-role-permissions", {role, removedPermissions}, {
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

  const handleDeleteRole = async (role: RolePermission) => {
    const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/delete-role", {role}, {
      withCredentials: true
    });
    if (response.data.status === 'success') {
      setRolePermissions((prevRolePermissions) => {
        return prevRolePermissions.filter((currRole) => currRole.id !== role.id);
      })
      setUpdateStatus({text: 
        'Successfully removed ' + role.name + ' role',
        statusType: 'removed',
        status: true
      })
      setRoleDeleteWindow(false);
      setRole(undefined);
    } else {
      setUpdateStatus({text: 
        'Error removing ' + role.name + ' role',
        statusType: 'error',
        status: false
      })
    }
  }
  
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
                    <Button 
                      variant="danger"
                      onClick={() => {
                        setRoleDeleteWindow(true)
                        setRole(role)
                      }}
                    >Delete</Button>
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
      {roleDeleteWindow ? (
          <GenericModal
            show={roleDeleteWindow}
            onHide={() => {
              setRoleDeleteWindow(false)
              setRole(undefined)
            }}
            headerClassName='role-user-header bg-danger text-white'
            title='Role Delete Confirmation'
            extraButton="Delete"
            extraButtonVariant="danger"
            extraAction={() => handleDeleteRole(role as RolePermission)}
          >
            <Alert variant='danger'>
              You are about to delete this role. Are you sure you want to continue?
            </Alert>
          </GenericModal>
        ) : null}
      <NewRoleComponent
        setRolePermissions={setRolePermissions}
        setUpdateStatus={setUpdateStatus}
      />
    </>
  ); 
}

export default RoleTypes;