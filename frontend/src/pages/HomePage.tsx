import React from "react";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.css";
import "./homepage.scss";


const HomePage = () => {
    return (
        <div className="home-page">
            <Form>
                <Form.Group className="email" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"/>
                </Form.Group>
                <Form.Group className="pass" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(value) => console.log(value.target.value)}
                    />
                </Form.Group>
            </Form>
        </div>
    );
};

export default HomePage;
