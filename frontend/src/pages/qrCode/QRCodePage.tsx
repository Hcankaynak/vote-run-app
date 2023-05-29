import {QRCodeGenerator} from "../../components/QRCodeGenerator/QRCodeGenerator";
import "./qrCodePage.scss";
import {useLocation} from "react-router-dom";
import React from "react";

export const QRCodePage = () => {
    const {state} = useLocation();
    const qrCodeData = React.useMemo(() => {
        const hostName = window.location.origin;
        const presentationId = state?.presentationId ?? "emptyData";
        console.log(hostName + "/" + "answers" + "/" + presentationId);
        return hostName + "/" + "answers" + "/" + presentationId;
    }, [state]);

    return (
        <div className="qr-code-page-content">
            <QRCodeGenerator qrCodeData={qrCodeData}/>
            <a href={qrCodeData}>Go To Topics</a>
        </div>
    )
}
