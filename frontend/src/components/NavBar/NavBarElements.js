import { FaBars } from "react-icons/fa";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const Nav = styled.nav`
    background: #e8514a;
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    z-index: 12;
`;

export const Logo = styled.div`
    display: flex;
    flex-direction: column;
    color: white;
    font-weight: bold;
    h1 {
        font-size: 1.5rem;
        margin: 0;
    }
    p {
        font-size: 0.75rem;
        margin: 0;
    }
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background: white;
    border-radius: 25px;
    padding: 8px 16px;
    width: 40%;
    gap: 8px;
    input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 1rem;
    }
`;

export const NavActions = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
`;

export const NavActionItem = styled.span`
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
`;

export const ProfileIcon = styled(Link)`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.4rem;
    color: white;
    text-decoration: none;
`;

export const CategoryBar = styled.div`
    display: flex;
    background: white;
    border-bottom: 1px solid #ddd;
`;

export const Bars = styled(FaBars)`
    display: none;
    color: white;
    @media screen and (max-width: 768px) {
        display: block;
        font-size: 1.8rem;
        cursor: pointer;
    }
`;