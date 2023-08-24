import React, { useContext, useEffect, useState } from "react";
import "./Shop.scss";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import "./components/product/Product";
import Product from "./components/product/Product";
import Filter from "./components/filter/Filter";
import Spinner from "../../components/spinner/Spinner";
import Paging from "./components/paging/Paging";
import ShowInfoPopup from "../../components/showInfoPopup/ShowInfoPopup";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const location = useLocation();
  const { token } = useContext(UserContext);
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPage, setFilterPage] = useState(0);
  const [filterCategorie, setFilterCategorie] = useState("all");
  const [msgError, setMsgError] = useState("");
  const [recupParamUrl, setRecupParamUrl] = useState(false);

  useEffect(() => {
    //Vérifie si il y a le parametre category dans url
    const paramUrlUpdate = () => {
      const urlSearchParams = new URLSearchParams(location.search);
      const hasContactParam = urlSearchParams.get("category");

      if (hasContactParam && !recupParamUrl) {
        removeCategoryParamFromUrl();
        setRecupParamUrl(true);
        setFilterCategorie(hasContactParam);
        return true;
      }
    };

    //Supprime le parametre category de l'url de manière visuel
    const removeCategoryParamFromUrl = () => {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("category");
      window.history.replaceState({}, document.title, newUrl);
    };

    //Récupére tous les produits avec un stock supérieur à 0
    const getAllProductsWithStock = () => {
      const filterQuantityMinToShow = 1;
      const filterStock = "empty";
      const filterPrice = "empty";
      const apiUrl =
        "https://cozy-lunchroom-production.up.railway.app/api/product/all/" +
        filterPage +
        "/" +
        filterCategorie +
        "/" +
        filterQuantityMinToShow +
        "/" +
        filterStock +
        "/" +
        filterPrice;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          setListProduct(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response.data === "Error: Categorie not found") {
            setMsgError(
              "La catégorie n'a pas été trouvée, veuillez réessayer ultérieurement"
            );
            setTimeout(() => {
              setMsgError("");
            }, 3000);
          }
          setIsLoading(false);
        });
    };

    const urlContentParam = paramUrlUpdate();
    if (!urlContentParam) {
      getAllProductsWithStock();
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filterPage, filterCategorie]);

  return (
    <div className="page-shop">
      <div className="title-page">Boutique</div>

      <Filter
        filterCategorie={filterCategorie}
        setFilterCategorie={setFilterCategorie}
        setFilterPage={setFilterPage}
      />

      {!isLoading ? (
        <>
          <div className="row">
            {listProduct.map((item) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
                <Product info={item} />
              </div>
            ))}
          </div>
          <div>
            <Paging
              filterPage={filterPage}
              setFilterPage={setFilterPage}
              filterCategorie={filterCategorie}
            />
          </div>
        </>
      ) : (
        <Spinner />
      )}

      {msgError !== "" && (
        <ShowInfoPopup msg={msgError} type="error"></ShowInfoPopup>
      )}
    </div>
  );
};

export default Shop;
