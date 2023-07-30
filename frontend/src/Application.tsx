import {Route, Routes} from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/home/HomePage";
import {LayoutComponent} from "./components/LayoutComponent";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
// TODO: how to store firebase config?
import "./config/firebase-config"
import React from "react";
import {PresentationCreator} from "./pages/presentation/PresentationCreator";
import {getAuth} from "firebase/auth";
import AnswersPage from "./pages/anwers/AnswersPage";
import QuestionAnswersPage from "./pages/questionAnswers/QuestionAnswersPage";
import {QRCodePage} from "./pages/qrCode/QRCodePage";
import {UserNavbar} from "./components/UserNavbar/UserNavbar";
import Footer from "./components/Footer/Footer";
import "./application.scss";
import PresentationsPage from "./pages/presentations/PresentationsPage";

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
        <div className="application">
            <UserNavbar/>
            <Routes>
                {
                    // TODO: update here, when login and register pages are finished.
                    // TODO: add error path
                }
                <Route path="/" element={<HomePage userId={userId}/>}/>
                <Route path="about">
                    <Route index element={<AboutPage/>}/>
                    <Route path=":number" element={<AboutPage/>}/>
                </Route>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="qrcode" element={<QRCodePage/>}/>
                <Route path="answers">
                    <Route index element={<AnswersPage/>}/>
                    <Route path=":presentationId"
                           element={<AnswersPage/>}/>
                </Route>
                <Route path="questionAnswers" element={<QuestionAnswersPage/>}/>
                <Route path="presentation" element={<PresentationCreator userId={userId}/>}/>
                <Route path="presentations">
                    <Route index element={<PresentationsPage/>}/>
                    <Route path=":presentationId"
                           element={<PresentationsPage/>}/>
                </Route>
                <Route path="layout" element={<LayoutComponent/>}>
                    <Route index element={<AboutPage/>}/>
                    <Route path=":number" element={<AboutPage/>}/>
                </Route>
            </Routes>
            <Footer/>
        </div>
    );
};

export default Application;
