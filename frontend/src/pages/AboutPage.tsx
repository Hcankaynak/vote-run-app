import React from "react";
import {useParams} from "react-router-dom";

const AboutPage = () => {
    const [message, setMessage] = React.useState("");
    const {number} = useParams();

    React.useEffect(() => {
        if (number) {
            setMessage("There is your number: " + number);
        } else {
            setMessage("No number provided");
        }
    }, []);
    return (
        <div>
            <p>This is About Page.</p>
            <p>{message}</p>
        </div>
    );
};

export default AboutPage;
