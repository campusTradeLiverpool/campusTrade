import React from "react";
import { FaSearch, FaUserCircle, FaEnvelope } from "react-icons/fa";
import {
    Nav,
    Logo,
    SearchBar,
    NavActions,
    NavActionItem,
    ProfileIcon,
    CategoryBar,
    CategoryItem,
} from "./NavBarElements";

const Navbar = () => {
    const user = localStorage.getItem('user');

    const handleProfileClick = () => {
        if (user) {
            window.location.href = '/profile';
        } else {
            window.location.href = '/register';
        }
    };

    return (
        <>
            <Nav>
                <Logo>
                    <h1>campusTrade</h1>
                    <p>University of Liverpool</p>
                </Logo>
                <SearchBar>
                    <input type="text" placeholder="" />
                    <FaSearch color="#888" />
                </SearchBar>
                <NavActions>
                    <NavActionItem onClick={() => window.location.href = '/'}>BUY</NavActionItem>
                    <NavActionItem onClick={() => window.location.href = '/sell'}>SELL</NavActionItem>
                    <NavActionItem onClick={() => window.location.href = '/inbox'}>
                        <FaEnvelope />
                    </NavActionItem>
                    <ProfileIcon onClick={handleProfileClick}>
                        <FaUserCircle />
                    </ProfileIcon>
                </NavActions>
            </Nav>
            <CategoryBar>
                <CategoryItem>Clothes</CategoryItem>
                <CategoryItem>Homeware</CategoryItem>
                <CategoryItem>Other</CategoryItem>
                <CategoryItem>Recently Added</CategoryItem>
            </CategoryBar>
        </>
    );
};

export default Navbar;