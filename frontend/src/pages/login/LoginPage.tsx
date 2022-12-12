import Form from "react-bootstrap/Form";
import React from "react";
import "./loginPage.scss";
import {Button} from "react-bootstrap";

interface ILoginData {
    email: string;
    password: string;
}

const LoginPage = () => {

    const [loginData, setLoginData] = React.useState({} as ILoginData);


    return (
        <div className="login-page">
            <Form>
                <Form.Group className="email" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"
                                  onChange={(value) => setLoginData({...loginData, email: value.target.value})}/>
                </Form.Group>
                <Form.Group className="pass" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(value) => setLoginData({...loginData, password: value.target.value})}
                    />
                </Form.Group>
                <div className="login-button-shell">
                    <Button className="login-button" type="button" onClick={() => console.log(loginData)}>Login</Button>
                </div>
            </Form>
        </div>
    )
}

export default LoginPage;