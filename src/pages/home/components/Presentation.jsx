import React from "react";
import "./Presentation.scss";
import { NavLink } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";

const Presentation = () => {
  return (
    <div className="presentation">
      <div className="title">
        <p>Coutures fait main</p>
        <p>et sur mesure</p>
      </div>
      <div className="description">
        <p>
          M&C fabric est un atelier de couture qui vous propose différentes
          créations sur mesure.
        </p>
        <p>
          Il est également possible de faire des reprises courutre, ourlet...
        </p>
      </div>

      <NavLink to="/shop" className="shop" aria-label="redirectShop">
        <button className="btn btn-primary" aria-label="btnBoutique">
          <CgShoppingCart size={22} />
          Accès boutique
        </button>
      </NavLink>
    </div>
  );
};

export default Presentation;
