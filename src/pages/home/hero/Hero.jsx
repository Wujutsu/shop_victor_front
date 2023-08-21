import React from "react";
import "./Hero.scss";
import { NavLink } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h3>M&C Fabric</h3>
        <h1>Créations de Couture Sur Mesure</h1>
        <p>
          Des pièces uniques faites avec amour. M&C Fabric est un atelier de
          couture qui vous propose différentes créations sur mesure. Il est
          également possible de faire des reprises couture, ourlets, et plus.
        </p>
        <NavLink to="/shop" className="shop" aria-label="redirectShop">
          <button className="btn btn-success" aria-label="btnBoutique">
            <div className="in-btn">
              <CgShoppingCart size={22} />
              Accès boutique
            </div>
          </button>
        </NavLink>
      </div>
    </section>
  );
};

export default Hero;
