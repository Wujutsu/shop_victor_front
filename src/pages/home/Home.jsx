import React, { useEffect, useState } from "react";
import "./Home.scss";

import Hero from "./hero/Hero";
import ProductsExemple from "./productsExemple/ProductsExemple";
import FormContact from "./formContact/FormContact";
import { useLocation } from "react-router-dom";
import Footer from "./footer/Footer";

export const Home = () => {
  const location = useLocation();
  const [recupParamUrl, setRecupParamUrl] = useState(false);

  useEffect(() => {
    const redirectBottomPageForAccesFormContact = () => {
      const urlSearchParams = new URLSearchParams(location.search);
      const hasContactParam = urlSearchParams.get("form");

      if (hasContactParam && !recupParamUrl) {
        setRecupParamUrl(true);
        removeCategoryParamFromUrl();

        const scrollToBottom = () => {
          window.scrollTo({
            top: document.body.scrollHeight - 650,
            behavior: "smooth",
          });
        };

        setTimeout(() => {
          scrollToBottom();
        }, 500);
      }
    };

    redirectBottomPageForAccesFormContact();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  //Supprime le parametre category de l'url de manière visuel
  const removeCategoryParamFromUrl = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("form");
    window.history.replaceState({}, document.title, newUrl);
  };

  return (
    <div className="mc-fabric-home-page">
      <Hero />
      <ProductsExemple />
      <FormContact />
      <Footer />
    </div>
  );
};

export default Home;
