import "./AdminPortal.css";
import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";


function RegisterUsers() {
    // useForm hook
    const { register, handleSubmit, formState: {errors} } = useForm();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const registerUser = () => {

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    }

    return (
        <div className="register-user-container">
            <h2>Register Users</h2>
            <Form className="register-user-form">
                <Form.Group controlId="username">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Username (4 characters max)</Form.Label>
                    <Form.Control
                        className="w-50"
                        maxLength={4}
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Password (8 characters max)</Form.Label>
                    <InputGroup className="w-50">
                        <Form.Control
                            maxLength={8}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                marginBottom: '0px',
                            }}
                        />
                        <InputGroup.Text className="password-toggle" onClick={toggleShowPassword}>
                            {showPassword ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Confirm Password</Form.Label>
                    <Form.Control
                        className="w-50"
                        maxLength={8}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
            </Form>

            <Button onClick={(e) => {
                e.preventDefault();
                registerUser();
            }}
            variant="primary" type="submit">Submit</Button>
        </div>
    );
}

export default RegisterUsers;