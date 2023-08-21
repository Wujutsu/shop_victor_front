import React from "react";
import "./Home.scss";

import Hero from "./hero/Hero";
import ProductsExemple from "./productsExemple/ProductsExemple";
import FormContact from "./formContact/FormContact";

export const Home = () => {
  return (
    <div className="mc-fabric-home-page">
      <Hero />
      <ProductsExemple />
      <FormContact />
    </div>
  );
};

export default Home;
