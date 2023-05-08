import "../AdminPortal.css"
import React, { useEffect, useState, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import Alert from "react-bootstrap/Alert";
import GenericModal from "../../../components/Popup/GenericPopup";
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import InputGroup from "react-bootstrap/InputGroup";
import { useForm } from "react-hook-form";

type User = {
    user_id: number,
    name: string,
    username: string,
    role_id: number,
  }

type PasswordResetProps = {
    forgotPasswordWindow: boolean,
    setForgotPasswordWindow: React.Dispatch<React.SetStateAction<boolean>>,
    user: User | undefined;
}

type FormValues = {
    [x: string]: string;
  };

const PasswordReset = ({forgotPasswordWindow, setForgotPasswordWindow, user} : PasswordResetProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        getValues
    } = useForm<FormValues>();
    
    const ChangePassword = async (data: FormValues) => {
        if (!user && !data.password) {
            return;
        }

        const { password } = data;
        const response = await Axios.post(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/reset-password", {
            user_id: user?.user_id,
            password: password,
        }, {withCredentials: true});

        if (response.data.status == "error") {
            alert(response.data.err);
            return;
        } 

        alert("Password changed successfully");
    }

    return (
        <GenericModal
            show={forgotPasswordWindow}
            onHide={() => {
                setForgotPasswordWindow(false);
            }}
            headerClassName='change-password-header bg-danger text-white'
            title='Change Password Confirmation'
            extraButton="Change Password"
            extraAction={handleSubmit((data) => ChangePassword(data))}
            extraButtonVariant="danger"
        >
        <Alert variant='danger'>
            <Form>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control 
                        style={{
                            marginBottom: '0px',
                        }}
                        type={showPassword ? "password" : "text"}
                        //value={get}
                        {...register("password", {
                            required: {
                                value: true,
                                message: "Password is required",
                            }
                        })}
                    /> 
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type={showPassword ? "password" : "text" }
                        {...register("confirmPassword", {
                            required: "Password is required",
                            validate: (value: string) => value === getValues('password') || "The passwords do not match",
                        })}
                    />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword?.message}</p>}
                </Form.Group>
                <InputGroup className="d-flex ">
                    <InputGroup.Text style={{width: '100%', justifyContent: 'center', marginTop: '10px'}} className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeSlash /> : <Eye />}
                    </InputGroup.Text> 
                </InputGroup>
            </Form>
        </Alert>
        </GenericModal>
    );
}

export default PasswordReset;