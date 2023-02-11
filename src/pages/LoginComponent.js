import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../hooks/AuthProvider';
import Axios from 'axios';
import { decodeToken } from "react-jwt";
import '../Login.css';
import Logo from '../esd8_logo.png';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
        Axios.post("http://localhost:5000/api/login", {username, password}, {
            withCredentials: true
        }
        ).then((response) => {
            const token = response.data.token;
            const decodedToken = decodeToken(token);
            login(decodedToken.username);
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <div className="Login">
            <div className="login-form-container">
                <img src={Logo} alt="ESD8 Logo" />
            
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="username">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button className="login-button" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
            </div>
        </div>
    );
}