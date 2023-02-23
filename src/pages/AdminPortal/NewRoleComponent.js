import { useForm } from "react-hook-form";
import React, { useState, useMemo } from "react";
import Axios from "axios";
import { permission } from "../../permissions"
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'

function NewRoleComponent({setNewRolePermissions, newRolePermissions, setRolePermissions, rolePermissions}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [selectedPermission, setSelectedPermission] = useState();

    const onSubmitData = async (data) => {
      const {role} = data;
      const response = await Axios.post('http://localhost:5000/api/insert-role-and-permissions', {role, addedPermissions: selectedPermission});
      if (response.data.status === 'success') {
        setRolePermissions((prevRolePermissions) => {
          return [...prevRolePermissions, {id: response.data.payload.roleId, name: role, combined_permissions: selectedPermission}]
        })
      } else {
        console.log('error');
      }
    }

    return (
      <div className="create-role-container">
        <h2>Create New Roles</h2>
        <div className="create-role-form">
          <Form 
            style={{display: 'flex', flexDirection: 'row', gap: '10px', width: 'fit-content'}}
            onSubmit={handleSubmit((data) => onSubmitData(data))}
          >
            <Form.Group style={{width: 'fit-content'}}>
                <Form.Control
                    type="text" placeholder="Enter role name"
                    {...register("role", { required: true })}
                />
            </Form.Group>
            <Form.Group>
              <DropdownButton id="dropdown-item-button" title="Permissions">
                {Object.entries(permission).map(([key, value]) => (
                  <Dropdown.ItemText key={value}>
                      <Form.Check
                        key={key}
                        type="checkbox"
                        label={key}
                        value={value}
                        onChange={(e) => {
                          setSelectedPermission(e.target.checked ? selectedPermission | value : selectedPermission & ~value)
                        }}
                      />
                  </Dropdown.ItemText>
                  ))}
              </DropdownButton>
            </Form.Group>
            <Button type="submit" style={{height: 'fit-content'}}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
}

export default NewRoleComponent;