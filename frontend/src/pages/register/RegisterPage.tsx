import Form from "react-bootstrap/Form";
import React from "react";
import "./registerPage.scss";
import {Button} from "react-bootstrap";

import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth'

interface IRegisterData {
    name: string;
    email: string;
    confirmationEmail: string;
    password: string;
    confirmationPassword: string;
}

interface IFormErrors {
    confirmationEmail: string;
    confirmationPassword: string;
}

const errors: IFormErrors = {
    confirmationEmail: "email",
    confirmationPassword: "pass"
}

/**
 * @author hcankaynak
 * @constructor
 */
const RegisterPage = () => {
    const [validated, setValidated] = React.useState(false);
    const [registerData, setRegisterData] = React.useState({} as IRegisterData);

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        console.log(registerData);
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);

    };

    const handleRegister = () => {
        // TODO: add validation.
        createUserWithEmailAndPassword(getAuth(), registerData.email, registerData.password).then((res) => {
            console.log(res.user);
        }).catch(err => console.log(err));
    }

    return (
        <div className="register-page">
            <Form validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="name input-element" controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type="name"
                        placeholder="Enter name"
                        onChange={(value) => setRegisterData({...registerData, name: value.target.value})}/>
                </Form.Group>

                <Form.Group className="email input-element" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Enter email"
                        onChange={(value) => setRegisterData({...registerData, email: value.target.value})}/>
                </Form.Group>
                <Form.Group className="email input-element" controlId="formGroupConfirmationEmail">
                    <Form.Label>Confirmation Email address</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="Enter Confirmation email"
                        isInvalid={registerData.email != registerData.confirmationEmail}
                        isValid={registerData.confirmationEmail != null && registerData.email == registerData.confirmationEmail}
                        onChange={(value) => setRegisterData({
                            ...registerData,
                            confirmationEmail: value.target.value
                        })}/>
                    <Form.Control.Feedback type="invalid">{errors.confirmationEmail}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="email input-element" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter Password"
                        onChange={(value) => setRegisterData({...registerData, password: value.target.value})}/>
                </Form.Group>
                <Form.Group className="pass input-element" controlId="formGroupConfirmationPassword">
                    <Form.Label>Confirmation Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter Confirmation Password"
                        isInvalid={registerData.password != registerData.confirmationPassword}
                        isValid={registerData.confirmationPassword != null && registerData.password == registerData.confirmationPassword}
                        onChange={(value) => setRegisterData({
                            ...registerData,
                            confirmationPassword: value.target.value
                        })}
                    />
                </Form.Group>
                <div className="register-button-shell input-element">
                    <Button
                        className="register-button"
                        type="submit"
                        onClick={() => handleRegister()}>Register</Button>
                </div>
            </Form>
        </div>
    )
}

export default RegisterPage;