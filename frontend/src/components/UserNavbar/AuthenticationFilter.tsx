import React from "react";

interface IAuthenticationFilter {
    token;
    children?;
}

const AuthenticationFilter = (props: IAuthenticationFilter) => {
    return React.useMemo(() => {
        if (props.token) {
            return props.children;
        }
        return null;
    }, props.token)
}
export default AuthenticationFilter;
