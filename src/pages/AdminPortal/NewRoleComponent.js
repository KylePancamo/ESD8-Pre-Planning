import { useForm } from "react-hook-form";
import React, { useState, useMemo } from "react";
import Axios from "axios";
import { permission } from "../../permissions"
import Form from "react-bootstrap/Form";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'

function NewRoleComponent({setNewRolePermissions, newRolePermissions, setRolePermissions}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // const onSubmit = (data) => {
    //     console.log('asdad');

    //     e.preventDefault();
    //     const role = e.currentTarget.elements[0].value;
    //     setRolePermissions((prevRolePermissions) => {
    //       return [...prevRolePermissions, {id: prevRolePermissions.length + 1, name: role, combined_permissions: newRolePermissions}]
    //     })
    // }

    return (
        <div className="create-role-container">
        <h2>Create New Roles</h2>
        <div className="create-role-form">
          <Form 
            style={{display: 'flex', flexDirection: 'row', gap: '10px', width: 'fit-content'}}
            onSubmit={() => console.log('adsa')}
          >
            <Form.Group style={{width: 'fit-content'}}>
                <Form.Control
                    type="text" placeholder="Enter role name"
                    //{...register("role", { required: true })}
                />
                {/* {errors.role && <span style={{color: 'red'}}>Role name is required</span>} */}
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
                          setNewRolePermissions(e.target.checked ? newRolePermissions | value : newRolePermissions & ~value)
                        }}
                      />
                  </Dropdown.ItemText>
                  ))}
              </DropdownButton>
            </Form.Group>
            <Button style={{height: 'fit-content'}}>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
}

export default NewRoleComponent;