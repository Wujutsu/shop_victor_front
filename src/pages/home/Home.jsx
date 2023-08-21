import React, { useEffect } from "react";
import "./Home.scss";

import Hero from "./hero/Hero";
import ProductsExemple from "./productsExemple/ProductsExemple";
import FormContact from "./formContact/FormContact";
import { useLocation } from "react-router-dom";

export const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const urlSearchParams = new URLSearchParams(location.search);
      const hasContactParam = urlSearchParams.get("form");

      if (hasContactParam) {
        const elementToClick = document.getElementById(
          "clickRedirectFormContact"
        );
        elementToClick.click();
      }
    };

    handleHashChange();
  }, [location.search]);

  return (
    <div className="mc-fabric-home-page">
      <Hero />
      <ProductsExemple />

      <a href="#contact" className="invisible" id="clickRedirectFormContact">
        form contact
      </a>
      <div id="contact">
        <FormContact />
      </div>
    </div>
  );
};

export default Home;
