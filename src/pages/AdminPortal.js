import "./AdminPortal.css"
import React, { useEffect, useState } from "react";
import Axios from "axios";


function UserRoles() {
    const [users, setUsers] = useState([
        {
            id: 1,
            username: "test",
            roleId: 2,
        },
        {
            id: 2,
            username: "test2",
            roleId: 2,
        },
        {
            id: 3,
            username: "test3",
            roleId: 2,
        },
        {
            id: 4,
            username: "test4",
            roleId: 2,
        }
    ]);
    const [roles, setRoles] = useState([
        { id: 1, name: "Admin" }, 
        { id: 2, name: "User" }
    ]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleRoleChange = (userId, roleId) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, roleId } : user
          )
        );
    };
  
    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className='user-roles-container'>
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
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>
                    <select
                      value={user.roleId}
                      onChange={(e) => {
                        const roleId = parseInt(e.target.value);
                        handleRoleChange(user.id, roleId)
                        }
                      }
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ); 
}

function RoleTypes() {

    return (
        <div className="role-types-loaded-component">
            
        </div>
    );
}

function AdminPortal() {

    const [portalType, setPortalType] = useState('update');
    const portalTypes = {
        "userRoles": <UserRoles />,
        "roleTypes": <RoleTypes />
    }

    return (
        <div className="admin-background">
            <div className="admin-wrapper">
                <div className="admin-form-wrapper">
                    <h2>Admin Portal</h2>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setPortalType("userRoles")
                    }}>
                        Modify User Roles
                    </button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setPortalType("roleTypes")
                    }}>
                        Modify Role Types
                    </button>
                </div>
                <div className="loaded-component">
                    <div className="loaded-component-container">
                        {
                            portalTypes[portalType]
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminPortal;