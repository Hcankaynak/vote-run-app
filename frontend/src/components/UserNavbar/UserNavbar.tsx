import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from "react-bootstrap/Container";
import {NavDropdown} from "react-bootstrap";
import {getAuth, signOut} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import React from "react";

export const UserNavbar = (props) => {
    const token = window.localStorage.getItem('auth')
    const navigate = useNavigate();
    const auth = getAuth();
    const logout = () => {
        window.localStorage.removeItem('auth');
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            navigate("/login")
        }).catch((error) => {
            console.log(error);
        })
    }

    React.useEffect(() => {
        // TODO: how to revoke token ?
        auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                window.localStorage.setItem('auth', userCred.email);
                userCred.getIdToken().then((token) => {
                    console.log(token);
                    window.localStorage.setItem('auth', token);
                })
            } else {
                navigate("/login");
            }
        })
    }, [])

    return (
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand onClick={() => navigate("/")}>Home</Navbar.Brand>
                    <Nav>
                        <Nav.Link onClick={() => navigate("/presentation")}>Create Presentation</Nav.Link>

                        <NavDropdown title="user" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => logout()}> Logout </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            {props.children}
        </>
    );
};
