import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./homepage.scss";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";


const HomePage = () => {
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

    return (
        <div className="home-page">
            <>
                <h1>HomePage</h1>
                <Button className="logout-button" type="button" onClick={() => logout()}>Logout</Button>
            </>
            <div className="home-page-content">
                <Button onClick={() => navigate("presentation")}>
                    Presentation
                </Button>
                <Button onClick={() => navigate("qrcode")}>
                    qrcode
                </Button>
                <Button onClick={() => navigate("questions")}>
                    questions
                </Button>
                <Button onClick={() => navigate("answers")}>
                    answers
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
