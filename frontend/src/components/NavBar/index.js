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
    const [search, setSearch] = React.useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            window.location.href = `/?search=${encodeURIComponent(search)}`;
        }
    };

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
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <FaSearch color="#888" onClick={() => {
                        if (search.trim()) window.location.href = `/?search=${encodeURIComponent(search)}`;
                    }} style={{cursor: 'pointer'}} />
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
        </>
    );
};

export default Navbar;