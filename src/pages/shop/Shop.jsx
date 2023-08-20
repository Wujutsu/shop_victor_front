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

const Shop = () => {
  const { token } = useContext(UserContext);
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPage, setFilterPage] = useState(0);
  const [filterCategorie, setFilterCategorie] = useState("all");
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    //Récupére tous les produits avec un stock supérieur à 0
    const getAllProductsWithStock = () => {
      const filterQuantityMinToShow = 1;
      const filterStock = "empty";
      const apiUrl =
        "http://localhost:8080/api/product/all/" +
        filterPage +
        "/" +
        filterCategorie +
        "/" +
        filterQuantityMinToShow +
        "/" +
        filterStock;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const listProductWithItem = response.data;

          setListProduct(listProductWithItem);
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

    getAllProductsWithStock();
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
        <div className="row">
          {listProduct.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
              <Product info={item} />
            </div>
          ))}
        </div>
      ) : (
        <Spinner />
      )}

      <Paging
        filterPage={filterPage}
        setFilterPage={setFilterPage}
        filterCategorie={filterCategorie}
      />

      {msgError !== "" && (
        <ShowInfoPopup msg={msgError} type="error"></ShowInfoPopup>
      )}
    </div>
  );
};

export default Shop;
