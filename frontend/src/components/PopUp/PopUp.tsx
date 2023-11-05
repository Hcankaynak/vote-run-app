import {Button} from "react-bootstrap";
import "./popUp.scss";
import {useOutsideClick} from "./useOutsideClick";
import {useRef} from "react";

interface IPopUp {
    isVisible: boolean;
    closeCallBack: () => void;
    className?: string;
    body: JSX.Element;
}

export const PopUp = (props: IPopUp) => {
    const popUpContentRef = useRef(null);
    useOutsideClick(popUpContentRef, props.closeCallBack)

    return (
        props.isVisible &&
        <div className={"popup-container " + props.className}>
            <div className="popup-content" ref={popUpContentRef}>
                <div className="popup-header">
                    <div className="popup-close-button">
                        <div onClick={() => {
                            props.closeCallBack()
                        }
                        }>
                            <i className="far fa-circle-xmark"></i>
                        </div>
                    </div>

                </div>
                <div className="popup-body">
                    {props.body}
                </div>
            </div>

        </div>
    )
}
