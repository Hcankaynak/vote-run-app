import React from "react";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";

interface IUseAuthenticate {
    forceLogin?: boolean;
    setIsLoggedIn?: (bool: boolean) => void;
}

const useAuthenticate = (props: IUseAuthenticate) => {
    const auth = getAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                window.localStorage.setItem('auth', userCred.email);
                props.setIsLoggedIn(true);
                userCred.getIdToken().then((token) => {
                    console.log(token);
                    window.localStorage.setItem('auth', token);
                })
            } else {
                if (props.forceLogin) {
                    navigate("/login");
                }
            }
        })
    }, [])
}

export default useAuthenticate;
