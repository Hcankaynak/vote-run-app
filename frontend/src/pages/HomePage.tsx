import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./homepage.scss";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import axios from "axios";


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

    React.useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const res = await axios.get("http://localhost:3001/api", {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        console.log(res.data);
    }

    return (
        <div className="home-page">
            <h1>HomePage</h1>
            <Button className="logout-button" type="button" onClick={() => logout()}>Logout</Button>
        </div>
    );
};

export default HomePage;
