import "./AdminPortal.css";
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";


function RegisterUsers() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registerStatus, setRegisterStatus] = useState(undefined);


    return (
        <div className="register-user-container">
            <h2>Register Users</h2>
            <Form className="register-user-form">
                <Form.Group size="lg" controlId="username">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Username (4 characters max)</Form.Label>
                    <Form.Control
                    //length of textbox
                        className="w-50"
                        maxLength="4"
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Password (8 characters max)</Form.Label>
                    <Form.Control
                        className="w-50"
                        maxLength="8"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="confirmPassword">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Confirm Password</Form.Label>
                    <Form.Control
                        className="w-50"
                        maxLength="8"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
            </Form>

            <Button variant="primary" type="submit">Submit</Button>
        </div>
    );
}

export default RegisterUsers;