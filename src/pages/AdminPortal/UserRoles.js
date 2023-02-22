import "./AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function UserRoles() {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [updateStatus , setUpdateStatus] = useState(undefined);

    const currentRoles = {
      1: "admin",
      2: "user",
    }

    useEffect(() => {
      const fetchUserRoles = async () => {
        const response = await Axios.get("http://localhost:5000/api/get-user-roles", {withCredentials: true});
        console.log(response);
        setUsers(response.data.payload);
      }

      const fetchRoles = async () => {
        const response = await Axios.get("http://localhost:5000/api/get-roles");
        setRoles(response.data.payload);
      }

      fetchUserRoles();
      fetchRoles();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
  
    const handleRoleChange = (user, roleId) => {
        setUsers((prevUsers) =>
          prevUsers.map((currUser) =>
            currUser.user_id === user.user_id ? { ...currUser, role_id: roleId } : currUser
          )
        );
    };
  
    const filteredUsers = useMemo(
      () =>
        users.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      [users, searchTerm]
    );

    const updateUser = async (user) => {
      console.log(user);
      const response = await Axios.post("http://localhost:5000/api/update-user-role", user, {withCredentials: true});

      if (response.data.status == 'success') {
        setUpdateStatus(true);
      } else if (response.datastatus == 'error') {
        setUpdateStatus(false);
      }
    }
    return (
      <div className='user-roles-container'>
        <h2>Modify User Roles</h2>
        {users.length !== 0 ? (
          <>
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
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Update Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.username}</td>
                      <td>
                        {roles.length !== 0 ? (
                          <Form.Select
                            value={user.role_id}
                            onChange={(e) => {
                                const roleId = parseInt(e.target.value);
                                handleRoleChange(user, roleId)
                              }
                            }>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                            ))}
                          </Form.Select>
                          ) : null}
                      </td>
                      <td>
                        <button onClick={() => {updateUser(user)}}>Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{marginTop: "10px"}}>
                {updateStatus == true ? (
                  <Alert variant='success'>
                    User role updated successfully!
                  </Alert>
                ) : updateStatus == false ? (
                  <Alert variant='danger'>
                    User role update failed!
                  </Alert>
                ) : null}
              </div>
            </div>
          </>
        ) : null }
      </div>
    ); 
}

export default UserRoles;