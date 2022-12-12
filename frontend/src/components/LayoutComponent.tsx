import * as React from 'react';
import {Outlet} from "react-router-dom";
import {TSNavbar} from "./Navbar";

export interface ILayoutComponent {

}

export const LayoutComponent = (props: ILayoutComponent) => {
    return (
        <div className="layout-component">
            <TSNavbar/>
            <Outlet/>
        </div>
    );
}