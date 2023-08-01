import React from "react";
import "./NavBar.scss";
import { NavLink } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { BiUser } from "react-icons/bi";
import logo from "../../assets/logo.webp";

export const NavBar = () => {
  const getActiveStyle = ({ isActive }) => {
    return { color: isActive ? "black" : "grey" };
  };

  return (
    <nav>
      <NavLink to="/" aria-label="redirectHome">
        <img src={logo} width="70" height=" 70" alt="Logo" />
        <div className="name-logo">M&C Fabric</div>
      </NavLink>

      <NavLink
        to="/shop"
        style={getActiveStyle}
        className="shop"
        aria-label="redirectShop"
      >
        Boutique
      </NavLink>

      <NavLink to="/cart" aria-label="redirectCart">
        <div className="position-cart">
          <button className="cart" aria-label="btnCart">
            <CgShoppingCart size={22} />
            <span className="cart-item-qty">0</span>
          </button>
        </div>
      </NavLink>

      <NavLink to="/login" aria-label="redirectLogin">
        <div className="position-login">
          <button className="login" aria-label="btnLogin">
            <BiUser size={22} />
          </button>
        </div>
      </NavLink>
    </nav>
  );
};

export default NavBar;
