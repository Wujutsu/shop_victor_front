import React from "react";
import "./Home.scss";

import Hero from "./hero/Hero";
import ProductsExemple from "./productsExemple/ProductsExemple";

export const Home = () => {
  return (
    <div className="mc-fabric-home-page">
      <Hero />
      <ProductsExemple />
    </div>
  );
};

export default Home;
