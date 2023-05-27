import {QRCodeGenerator} from "../../components/QRCodeGenerator/QRCodeGenerator";
import "./qrCodePage.scss";
import {useLocation} from "react-router-dom";
import React from "react";

export const QRCodePage = () => {
    const {state} = useLocation();
    const qrCodeData = React.useMemo(() => {
        const hostName = window.location.hostname;
        const presentationId = state?.presentationId ?? "emptyData";
        console.log("http://192.168.0.19:3000" + "/" + "answers" + "/" + presentationId);
        return "http://192.168.0.19:3000" + "/" + "answers" + "/" + presentationId;
    }, [state]);

    return (
        <div className="qr-code-page-content">
            <QRCodeGenerator qrCodeData={qrCodeData}/>
        </div>
    )
}
