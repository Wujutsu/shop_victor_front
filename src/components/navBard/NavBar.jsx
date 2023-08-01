import React, { useContext } from "react";
import "./NavBar.scss";
import { NavLink } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { BiUser } from "react-icons/bi";
import logo from "../../assets/logo.webp";
import { UserContext } from "../../contexts/UserContext";

export const NavBar = () => {
  const getActiveStyle = ({ isActive }) => {
    return { color: isActive ? "black" : "grey" };
  };
  const { isLogged, handleSaveLogout } = useContext(UserContext);

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

      {!isLogged ? (
        <div className="position-login">
          <div className="login">
            <BiUser size={22} />
            <div className="user-options">
              <NavLink to="/login" aria-label="redirectLogin">
                <button
                  className="btn btn-perso btn-primary"
                  aria-label="btnLogin"
                >
                  Se connecter
                </button>
              </NavLink>
              <NavLink to="/register" aria-label="redirectRegister">
                <button
                  className="btn btn-perso btn-primary"
                  aria-label="btnRegister"
                >
                  S'inscrire
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="position-login">
          <div className="login">
            <BiUser size={22} />
            <div className="user-options">
              <NavLink to="/account" aria-label="redirectAccount">
                <button
                  className="btn btn-perso btn-primary"
                  aria-label="btnAccount"
                >
                  Mon compte
                </button>
              </NavLink>
              <button
                className="btn btn-perso btn-danger"
                aria-label="btnLogout"
                onClick={() => handleSaveLogout()}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
