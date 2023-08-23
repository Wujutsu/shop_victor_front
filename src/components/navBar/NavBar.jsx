import React, { useContext, useEffect, useState } from "react";
import "./NavBar.scss";
import { NavLink } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { BiUser } from "react-icons/bi";
import logo from "../../assets/logo.webp";
import { UserContext } from "../../contexts/UserContext";
import ShowInfoPopup from "../showInfoPopup/ShowInfoPopup";

export const NavBar = () => {
  const getActiveStyle = ({ isActive }) => {
    return { color: isActive ? "black" : "grey" };
  };
  const { isLogged, handleLogout, nbCartItem, role } = useContext(UserContext);
  const [accessCartError, setAccessCartError] = useState(false);
  const [cartIncre, setCartIncre] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCartIncre(true);
      setTimeout(() => {
        setCartIncre(false);
      }, 1000);
    }, 200);
  }, [nbCartItem]);

  const handleAccessCartError = () => {
    setAccessCartError(true);

    setTimeout(() => {
      setAccessCartError(false);
    }, 3000);
  };

  return (
    <nav>
      <NavLink to="/" aria-label="redirectHome">
        <img src={logo} width="80" alt="Logo" />
        <div className="name-logo">M&C Fabric</div>
      </NavLink>

      <NavLink
        to="/?form=true"
        style={{ color: "grey" }}
        className="contact"
        aria-label="redirectFormContact"
      >
        Contact
      </NavLink>

      <NavLink
        to="/shop"
        style={getActiveStyle}
        className="shop"
        aria-label="redirectShop"
      >
        Boutique
      </NavLink>

      {!isLogged ? (
        <div className="position-cart">
          <button
            className={`${cartIncre ? "cart-incre" : "cart"}`}
            aria-label="btnCart"
            onClick={() => handleAccessCartError()}
          >
            <CgShoppingCart size={22} />
            <span className="cart-item-qty">{nbCartItem}</span>
          </button>
        </div>
      ) : (
        <NavLink to="/cart" aria-label="redirectCart">
          <div className="position-cart">
            <button
              className={`${cartIncre ? "cart-incre" : "cart"}`}
              aria-label="btnCart"
            >
              <CgShoppingCart size={22} />
              <span className="cart-item-qty">{nbCartItem}</span>
            </button>
          </div>
        </NavLink>
      )}

      {!isLogged ? (
        <div className="position-login">
          <div className="login">
            <BiUser size={22} />
            <div className="user-options">
              <NavLink to="/login" aria-label="redirectLogin">
                <button
                  className="btn btn-perso btn-dark"
                  aria-label="btnLogin"
                >
                  Se connecter
                </button>
              </NavLink>
              <NavLink to="/register" aria-label="redirectRegister">
                <button
                  className="btn btn-perso btn-dark"
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
              {role === "ROLE_ADMIN" && (
                <NavLink to="/admin" aria-label="redirectAdmin">
                  <button
                    className="btn btn-perso btn-danger"
                    aria-label="btnAdmin"
                  >
                    Gestion admin
                  </button>
                </NavLink>
              )}

              <NavLink to="/account" aria-label="redirectAccount">
                <button
                  className="btn btn-perso btn-dark"
                  aria-label="btnAccount"
                >
                  Mon compte
                </button>
              </NavLink>

              <button
                className="btn btn-perso btn-dark"
                aria-label="btnLogout"
                onClick={() => handleLogout()}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {accessCartError && (
        <ShowInfoPopup
          msg="Veuillez vous identifier pour accéder à votre panier"
          type="error"
        ></ShowInfoPopup>
      )}
    </nav>
  );
};

export default NavBar;
