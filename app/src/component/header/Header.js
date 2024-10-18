import React from 'react';
import { NavLink } from "react-router-dom";

import './Header.scss';

const Header = (props) => {
    return (
        <div className={`header`}>
            <div className={`header-inner`}>
                <h1 className={`header-title`}>{props.storeName}</h1>
                <nav className={`navigation`}>
                    <NavLink  to="/" className={`navigation-item`}>Order</NavLink>
                    <NavLink  to="/history" className={`navigation-item`}>History</NavLink>
                    <NavLink  to="/setting" className={`navigation-item`}>Setting</NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Header;