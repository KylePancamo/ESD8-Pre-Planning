import "../AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import GenericModal from "../../../components/Popup/GenericPopup";
import PasswordReset from "./PasswordReset";

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

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const inputRef = React.useRef<HTMLSelectElement>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [updateStatus , setUpdateStatus] = useState<{
      status: boolean | undefined,
      message: string
    }>({
      status: undefined,
      message: ''
    });

    const [userDeleteWindow, setUserDeleteWindow] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [forgotPasswordWindow, setForgotPasswordWindow] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
      const fetchUserRoles = async () => {
        const response = await Axios.get<{payload: User[]}>(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/get-user-roles", {withCredentials: true});
        console.log(response);
        setUsers(response.data.payload);
      }

      const fetchRoles = async () => {
        const response = await Axios.get<{payload: Role[]}>(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/get-roles", {withCredentials: true});
        console.log(response);
        setRoles(response.data.payload);
      }

      fetchUserRoles();
      fetchRoles();
    }, []);

    const [searchTerm, setSearchTerm] = useState<string>('');
  
    const handleRoleChange = (user: User, role: Role) => {
        setUsers((prevUsers: User[]) =>
          prevUsers.map((currUser: User) =>
            currUser.user_id === user.user_id ? { ...currUser, role_id: role.id, name: role.name} : currUser
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
      console.log(user);
      const response = await Axios.post<{status: string, err: string}>(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/update-user-role", user, {withCredentials: true});

      if (response.data.status == 'success') {
        setUpdateStatus({
          status: true,
          message: `${user.username}'s role was updated to ${roles.find((role: Role) => role.id == user.role_id)?.name} `
        });
      } else if (response.data.status == 'error') {
        setUpdateStatus({
          status: false,
          message: response.data.err
        });
      }
    }

    const deleteUser = async () => {
      if (!user) {
        return;
      }

      const response = await Axios.post<{status: string}>(process.env.REACT_APP_CLIENT_API_BASE_URL + "/api/delete-user", user, {withCredentials: true});
    
      if (response.data.status == 'success') {
        setUsers((prevUsers: User[]) => prevUsers.filter((currUser: User) => currUser.user_id !== user.user_id));
        setUpdateStatus({
          status: true,
          message: 'User deleted successfully'
        });
        setUserDeleteWindow(false);
      } else if (response.data.status == 'error') {
        setUpdateStatus({
          status: false,
          message: 'Error deleting user'
        });
      }

    }

    return (
      <div className='user-container'>
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
                    <th>Action</th>
                    <th>Delete</th>
                    <th>Change Password</th>
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
                                const role = {
                                  id: roleId,
                                  name: e.currentTarget.selectedOptions[0].text,
                                }
                                handleRoleChange(user, role)
                              }
                            }
                            ref={inputRef}
                            >
                            <option value={0}>No Role Assigned</option>
                            {roles.map((role: Role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                            ))}
                          </Form.Select>
                          ) : null}
                      </td>
                      <td>
                        <Button onClick={() => {updateUser(user)}}>Update</Button>
                      </td>
                      <td>
                        <Button onClick={() => {
                          setUserDeleteWindow(true);
                          setUser(user)
                          }} variant="danger">Delete User</Button>
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => {
                          setForgotPasswordWindow(true);
                          setUser(user)
                        }}>Change Password</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{marginTop: "10px"}}>
                {updateStatus.status == true ? (
                  <Alert variant='success'>
                    {updateStatus.message}
                  </Alert>
                ) : updateStatus.status == false ? (
                  <Alert variant='danger'>
                    {updateStatus.message}
                  </Alert>
                ) : null}
              </div>
            </div>
          </>
        ) : null }
        {userDeleteWindow ? (
          <GenericModal
            show={userDeleteWindow}
            onHide={() => {
              setUserDeleteWindow(false)
              setUser(undefined)
            }}
            headerClassName='delete-user-header bg-danger text-white'
            title='User Delete Confirmation'
            extraButton="Delete"
            extraButtonVariant="danger"
            extraAction={deleteUser}
          >
            <Alert variant='danger'>
              You are about to delete this user. Are you sure you want to continue?
            </Alert>
          </GenericModal>
        ) : null}
        {(forgotPasswordWindow && user) ? (
          <PasswordReset
            forgotPasswordWindow={forgotPasswordWindow}
            setForgotPasswordWindow={() => setForgotPasswordWindow(false)}
            user={user}
          />
        ) : null}
      </div>
    ); 
}

export default Users;