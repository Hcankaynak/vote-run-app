import "./footer.scss";
import {MDBFooter} from "mdb-react-ui-kit";

export const Footer = (props) => {
    return (
        <MDBFooter bgColor='light' className='text-center text-lg-left'>
            <div className='text-center p-3' style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                &copy; {new Date().getFullYear()} HcK,{' '}
                <a className='text-dark'>
                    All rights reserved.
                </a>
            </div>
        </MDBFooter>
    )
}

export default Footer;
