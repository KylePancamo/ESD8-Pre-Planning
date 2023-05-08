import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../hooks/AuthProvider';
import Axios from 'axios';
import { decodeToken } from "react-jwt";
import '../Login.css';
import Logo from '/esd8_logo.png';
import firetruck from '/firetruck.png';

import { UserData } from '../types/auth-types';

export default function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginStatus, setLoginStatus] = useState<{
        status: boolean,
        message: string,
    }>();
    const { login } = useAuth();

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/login", {username, password}, {
            withCredentials: true
        });
        if (response.data.status === "success") {
            const token = response.data.token;
            if (!token) {
                console.log(response.data);
                setLoginStatus({
                    status: false,
                    message: "Internal Error. No token returned.",
                })
                return;
            }

            const decodedToken: UserData | null = decodeToken(token);
            if (!decodedToken) {
                setLoginStatus({
                    status: false,
                    message: "Failed to decode token.",
                })
                return;
            }
            login(decodedToken);
        } else if (response.data.status === "error") {
            setLoginStatus({
                status: false,
                message: response.data.err as string,
            })
        }
    }

    return (
        <div className="Login" style={{backgroundImage: `url(${firetruck})`}}>
            <div className="login-form-container">
                <img src={Logo} alt="ESD8 Logo" />
            <Form className="login-form" onSubmit={handleSubmit}>
                <Form.Group controlId="username">
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
                <Form.Group controlId="password">
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
                {loginStatus?.status === false? (
                    <div className="error-message">
                        {loginStatus.message}
                    </div>
                ) : null }
            </Form>
            </div>
        </div>
    );
}