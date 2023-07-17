import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from "react-bootstrap/Container";
import {NavDropdown} from "react-bootstrap";
import {getAuth, signOut} from "firebase/auth";
import React from "react";
import "./userNavbar.scss";
import {useNavigate} from "react-router-dom";
import useAuthenticate from "../../hooks/Authentication";

export interface IUserNavbarProps {
}

export const UserNavbar = (props: IUserNavbarProps) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const token = window.localStorage.getItem('auth');
    const navigate = useNavigate();
    const auth = getAuth();
    useAuthenticate({setIsLoggedIn})

    const logout = () => {
        window.localStorage.removeItem('auth');
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            navigate("/login")
        }).catch((error) => {
            console.log(error);
        })
    }

    const goToHome = () => {
        if (isLoggedIn) {
            navigate("/")
        }
    }

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => goToHome()}>Answer Meter</Navbar.Brand>
                    {
                        isLoggedIn && <Nav>
                            <Nav.Link onClick={() => navigate("/presentation")}>Create
                                Presentation</Nav.Link>

                            <NavDropdown title="user" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => logout()}> Logout </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    }
                </Container>
            </Navbar>
        </>
    );
};
