import { useForm } from "react-hook-form";
import React, { useState, useMemo } from "react";
import Axios from "axios";
import { permission } from "../../permissions"
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'

type RolePermissions = {
  id: number,
  name: string,
  combined_permissions: number
}

type FormData = Record<string, string>;

type NewRoleComponentProps = {
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermissions[]>>
  setUpdateStatus: React.Dispatch<React.SetStateAction<{text: string, statusType: string, status: boolean | undefined}>>
}

function NewRoleComponent({setRolePermissions, setUpdateStatus} : NewRoleComponentProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [selectedPermission, setSelectedPermission] = useState<number>(0);

    const onSubmitData = async (data: FormData) => {
      const {role} = data;
      const response = await Axios.post(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/insert-role-and-permissions", {role, addedPermissions: selectedPermission}, {
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setRolePermissions((prevRolePermissions) => {
          return [...prevRolePermissions, {id: response.data.payload.roleId, name: role, combined_permissions: selectedPermission}]
        });
        setUpdateStatus({text: `Role created successfully`, statusType: 'success', status: true})
      } else {
        setUpdateStatus({text: `Role creation failed`, statusType: 'danger', status: false})
      }
    }

    return (
      <div className="create-role-container">
        <h2>Create New Roles</h2>
        <div className="create-role-form">
          <Form 
            style={{display: 'flex', flexDirection: 'row', gap: '10px', width: 'fit-content'}}
            onSubmit={handleSubmit((data: FormData) => onSubmitData(data))}
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