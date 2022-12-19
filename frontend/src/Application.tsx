import {BrowserRouter, Route, Routes} from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import {LayoutComponent} from "./components/LayoutComponent";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
// TODO: how to store firebase config?
import "./config/firebase-config"
import React from "react";

const Application = () => {
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

                <Route path="layout" element={<LayoutComponent/>}>
                    <Route index element={<AboutPage/>}/>
                    <Route path=":number" element={<AboutPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Application;
