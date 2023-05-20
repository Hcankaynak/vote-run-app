import Form from "react-bootstrap/Form";
import React from "react";
import "./loginPage.scss";
import {Button} from "react-bootstrap";
import {getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";


interface ILoginData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(window.localStorage.getItem('auth'));
    const [token, setToken] = React.useState<string>(null);

    const [loginData, setLoginData] = React.useState({} as ILoginData);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    React.useEffect(() => {
        // TODO: how to revoke token ?
        auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                window.localStorage.setItem('auth', userCred.email);
                userCred.getIdToken().then((token) => {
                    console.log(token);
                    window.localStorage.setItem('auth', token);
                    setIsLoggedIn(token)
                })
                navigate("/");
            }
        })
    }, [])

    const loginWithEmailAndPassword = () => {
        // TODO: add validation.
        signInWithEmailAndPassword(auth, loginData.email, loginData.password).then((userCredential) => {
            console.log(userCredential);
        }).catch(err => console.log(err));
    }

    const gotoRegisterPage = () => {
        navigate("/register");
    }

    // TODO: use redux here
    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                setIsLoggedIn(user.email)
                user.getIdToken().then(value => (token) => {
                    window.localStorage.setItem('auth', token);
                })

                console.log(user);
                // ...
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }
    return (
        <div className="login-page">
            <Form className="login-form-group">
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
                    <Button className="login-button" type="button"
                            onClick={() => loginWithEmailAndPassword()}>Login</Button>
                </div>
            </Form>
            <div className="register-button-shell input-element">
                <Button
                    className="register-button"
                    type="submit"
                    onClick={() => gotoRegisterPage()}>Register</Button>
            </div>
            {isLoggedIn ? <h1>Welcome {isLoggedIn}</h1> :
                <Button className="login-with-google-button" type="button" onClick={() => loginWithGoogle()}>Login with
                    Google</Button>}
        </div>
    )
}

export default LoginPage;
