import React from "react";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import {Nav, Logo, SearchBar, NavActions, NavBarLink, ProfileIcon} from "./NavBarElements";

const Navbar = () => {
    // gets the user from the local storage and creates a variable for it
    const user = localStorage.getItem('user');
    const [search, setSearch] = React.useState('');

    // function to handle search, if the user presses enter, it sends them to a link with the search query
    const Searching = (e) => {
        if (e.key === 'Enter') {
            window.location.href = `/?search=${encodeURIComponent(search)}`;
        }
    };

    // function to send the user to the profile if they are logged in and if not it sends them to the register page
    const handleProfileClick = () => {
        if (user) {
            window.location.href = '/profile';
        } else {
            window.location.href = '/register';
        }
    };

    return (
        <Nav>
            {/* logo on the navigation bar which when clicks takes the user back to the home menu */}
            <Logo>
                <h1><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>campusTrade</a></h1>
                <p>University of Liverpool</p>
            </Logo>

            {/* search bar for the navigation bar */}
            <SearchBar>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={Searching}
                />
            </SearchBar>

            {/* navigation links to buy, sell, inbox and profile, where profile and inbox is through icons */}
            <NavActions>
                <NavBarLink onClick={() => window.location.href = '/'}>TRADE</NavBarLink>
                <NavBarLink onClick={() => window.location.href = '/sell'}>SELL</NavBarLink>
                <NavBarLink onClick={() => window.location.href = '/inbox'}>
                    <FaEnvelope />
                </NavBarLink>
                <ProfileIcon onClick={handleProfileClick}>
                    <FaUserCircle />
                </ProfileIcon>
            </NavActions>
        </Nav>
    );
};

export default Navbar;