import "./AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

type User = {
  user_id: number,
  name: string,
  username: string,
  role_id: number,
}

type Role = {
  id: number,
  name: string;
}

function UserRoles() {

    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [updateStatus , setUpdateStatus] = useState<boolean | undefined>(undefined);

    const currentRoles = {
      1: "admin",
      2: "user",
    }

    useEffect(() => {
      const fetchUserRoles = async () => {
        const response = await Axios.get<{payload: User[]}>("http://localhost:5000/api/get-user-roles", {withCredentials: true});
        console.log(response);
        setUsers(response.data.payload);
      }

      const fetchRoles = async () => {
        const response = await Axios.get<{payload: Role[]}>("http://localhost:5000/api/get-roles");
        console.log(response);
        setRoles(response.data.payload);
      }

      fetchUserRoles();
      fetchRoles();
    }, []);

    const [searchTerm, setSearchTerm] = useState<string>('');
  
    const handleRoleChange = (user: User, roleId: number) => {
        setUsers((prevUsers: User[]) =>
          prevUsers.map((currUser: User) =>
            currUser.user_id === user.user_id ? { ...currUser, role_id: roleId } : currUser
          )
        );
    };
  
    const filteredUsers = useMemo(
      () =>
        users.filter((user: User) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      [users, searchTerm]
    );

    const updateUser = async (user: User) => {
      const response = await Axios.post<{status: string}>("http://localhost:5000/api/update-user-role", user, {withCredentials: true});

      if (response.data.status == 'success') {
        setUpdateStatus(true);
      } else if (response.data.status == 'error') {
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
                  {filteredUsers.map((user: User) => (
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
                            {roles.map((role: Role) => (
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