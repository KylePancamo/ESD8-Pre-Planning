import "./AdminPortal.css";
import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";

type FormValues = {
    [key: string]: string;
  };

function RegisterUsers() {
    // useForm hook
    const { register, handleSubmit, getValues, formState: {errors} } = useForm();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [registerStatus, setRegisterStatus] = useState<{
        status: boolean,
        message: string,
    }>();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const registerUser = async (data: FormValues) => {
        const response = await Axios.post<{status: string, message?: string, err?: string}>(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/register-user", data, {
            withCredentials: true
        });

        if (response.data.status === "success") {
            setRegisterStatus({
                status: true,
                message: response.data.message as string,
            })
        } else if (response.data.status === "error") {
            setRegisterStatus({
                status: false,
                message: response.data.err as string,
            })
        }
    }

    return (
        <div className="register-user-container">
            <h2>Register Users</h2>
            <Form onSubmit={handleSubmit((data) => registerUser(data))}className="register-user-form">
                <Form.Group controlId="username">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Username (4 characters min)
                    </Form.Label>
                    <Form.Control
                        className="w-50"
                        type="text"
                        {...register("username", {
                            required: {value: true, message: "Username is required"},

                        })}
                    />
                    {errors.username && (
                        <span style={{color: 'red'}}>
                            <>
                                {errors.username.message}
                            </>
                        </span>
                    )}
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Password (8 characters min)</Form.Label>
                    <InputGroup className="w-50">
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: {value: true, message: "Password is required"},
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                            style={{
                                marginBottom: '0px',
                            }}
                        />
                        <InputGroup.Text className="password-toggle" onClick={toggleShowPassword}>
                            {showPassword ? <EyeSlash /> : <Eye />}
                        </InputGroup.Text>
                    </InputGroup>
                    {errors.password && (
                            <span style={{color: 'red'}}>
                                <>
                                    {errors.password.message}
                                </>
                            </span>
                        )}
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                    <Form.Label style={{
                        fontFamily: 'Arial',
                    }}>Confirm Password</Form.Label>
                    <Form.Control
                        className="w-50"
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                            required: {value: true, message: "Confirm password is required"},
                            validate: (value) => {
                                const password = getValues("password");
                                return password === value || "Passwords do not match";
                            }
                        })}
                    />
                    {errors.confirmPassword && (
                        <span style={{color: 'red'}}>
                            <>
                                {errors.confirmPassword.message}
                            </>
                        </span>
                    )}
                </Form.Group>
                <Button type="submit">
                    Submit
                </Button>
            </Form>
            {registerStatus && (
                <Alert variant={registerStatus?.status ? "success" : "danger"}>
                    {registerStatus?.message}
                </Alert>
            )}
        </div>
    );
}

export default RegisterUsers;