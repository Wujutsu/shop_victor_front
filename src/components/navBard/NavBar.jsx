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
      <NavLink to="/">
        <img src={logo} width="70" height=" 70" alt="Logo" />
        <div className="name-logo">M&C Fabric</div>
      </NavLink>

      <NavLink to="/shop" style={getActiveStyle} className="shop">
        <li>Boutique</li>
      </NavLink>

      <NavLink to="/cart">
        <div className="position-cart">
          <button className="cart">
            <CgShoppingCart size={22} />
            <span className="cart-item-qty">0</span>
          </button>
        </div>
      </NavLink>

      <NavLink to="/login">
        <div className="position-login">
          <button className="login">
            <BiUser size={22} />
          </button>
        </div>
      </NavLink>
    </nav>
  );
};
