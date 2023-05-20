import {BrowserRouter, Route, Routes} from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import {LayoutComponent} from "./components/LayoutComponent";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
// TODO: how to store firebase config?
import "./config/firebase-config"
import React from "react";
import {QRCodeGenerator} from "./components/QRCodeGenerator/QRCodeGenerator";
import {PresentationCreator} from "./pages/presentation/PresentationCreator";
import {getAuth} from "firebase/auth";
import AnswersPage from "./pages/anwers/AnswersPage";
import QuestionsPage from "./pages/questions/QuestionsPage";

const Application = () => {

    const auth = getAuth();
    const [userId, setUserId] = React.useState("");
    React.useEffect(() => {
        // TODO: how to revoke token ?
        auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                setUserId(userCred.uid);
                userCred.getIdToken().then((token) => {
                    console.log(token);
                })
            }
        })
    }, [])
    return (
        <BrowserRouter>
            <Routes>
                {
                    // TODO: update here, when login and register pages are finished.
                    // TODO: LayoutComponent should be applied all pages.
                    // TODO: add error path
                }
                <Route path="/" element={<HomePage/>}/>
                <Route path="about">
                    <Route index element={<AboutPage/>}/>
                    <Route path=":number" element={<AboutPage/>}/>
                </Route>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="qrcode" element={<QRCodeGenerator/>}/>
                <Route path="answers" element={<AnswersPage/>}/>
                <Route path="questions" element={<QuestionsPage/>}/>
                <Route path="presentation" element={<PresentationCreator userId={userId}/>}/>
                <Route path="layout" element={<LayoutComponent/>}>
                    <Route index element={<AboutPage/>}/>
                    <Route path=":number" element={<AboutPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Application;
