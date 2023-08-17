import {QRCodeGenerator} from "../../components/QRCodeGenerator/QRCodeGenerator";
import "./qrCodePage.scss";
import {useLocation} from "react-router-dom";
import React from "react";
import {Button} from "react-bootstrap";
import {log} from "util";

export const QRCodePage = () => {
    const {state} = useLocation();

    const generatePath = (presentationId) => {
        const hostName = window.location.origin;
        console.log(hostName + "/" + "answers" + "/" + presentationId);
        return hostName + "/" + "presentations" + "/" + presentationId;
    };
    const qrCodeData = React.useMemo(() => {
        const hostName = window.location.origin;
        const presentationId = state?.presentationId ?? "emptyData";
        console.log(hostName + "/" + "answers" + "/" + presentationId);
        return hostName + "/" + "answers" + "/" + presentationId;
    }, [state]);

    return (
        <div className="qr-code-page-content">
            <QRCodeGenerator qrCodeData={qrCodeData}/>
            <div className="qr-code-buttons">
                <Button className="presentation-button" href={generatePath(state?.presentationId)}>Go To Presentation</Button>
                <Button onClick={() => {
                    console.log("test");
                    navigator.clipboard.writeText(qrCodeData).then(r => console.log(r));
                }}> <i className="far fa-copy"/> </Button>
            </div>
        </div>
    )
}
