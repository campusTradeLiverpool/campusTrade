import { FaBars } from "react-icons/fa";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
    background: #e8514a;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.1% 1.5%;
`;

export const Logo = styled.div`
    flex-direction: column;
    color: white;
    font-weight: bold;
    h1 {
        font-size: 24px;
        margin: 0;
    }
    p {
        font-size: 12px;
        margin: 0;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background: white;
    padding: 8px 16px;
    width: 40%;
    input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 16px;
    }
`;

export const NavActions = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    color: white;
    font-weight: bold;
    font-size: 18px;
`;

export const NavBarLink = styled.span`
    cursor: pointer;
`;

export const ProfileIcon = styled(Link)`
    width: 40px;
    height: 40px;
    align-items: center;
    cursor: pointer;
    font-size: 30px;
    color: white;
`;


