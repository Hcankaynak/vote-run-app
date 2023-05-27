import * as React from 'react';
import "./qrCodeGenerator.scss"
import QRCode from "react-qr-code";

export interface IQRCodeGenerator {
    qrCodeData: string;
}

export const QRCodeGenerator = (props: IQRCodeGenerator) => {

    return (
        <div className="qr-code-generator">
            <QRCode value={props.qrCodeData}/>
        </div>
    );
}
