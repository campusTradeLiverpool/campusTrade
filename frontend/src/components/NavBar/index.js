import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
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
                    <NavActionItem>BUY</NavActionItem>
                    <NavActionItem>SELL</NavActionItem>
                    <ProfileIcon to="/register" aria-label="Register">
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