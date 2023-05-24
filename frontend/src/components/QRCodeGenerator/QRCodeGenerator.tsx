import * as React from 'react';
import "./qrCodeGenerator.scss"
import QRCode from "react-qr-code";
import Form from "react-bootstrap/Form";
import {useLocation} from "react-router-dom";

export interface IQRCodeGenerator {

}

export const QRCodeGenerator = (props: IQRCodeGenerator) => {

    const [qrCodeData, setQRCodeData] = React.useState("");
    const { state } = useLocation();

    console.log(state);
    return (
        <div className="qr-code-generator">
            <QRCode value={qrCodeData}/>

            <Form.Group className="name input-element" controlId="formGroupName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    required
                    type="name"
                    placeholder="Enter name"
                    onChange={(value) => setQRCodeData(value.target.value)}/>
            </Form.Group>
        </div>
    );
}
