import React, { useContext, useEffect, useState } from "react";
import "./Shop.scss";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import "./components/product/Product";
import Product from "./components/product/Product";
import Filter from "./components/filter/Filter";
import Spinner from "../../components/spinner/Spinner";

const Shop = () => {
  const { token } = useContext(UserContext);
  const [listProductSave, setListProductSave] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //Récupére tous les produits avec un stock supérieur à 0
    const getAllProductsWithStock = () => {
      const apiUrl = "http://localhost:8080/api/product/all/stock";
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

          console.log("List produit => ", listProductWithItem);
          setListProductSave(listProductWithItem);
          setListProduct(listProductWithItem);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllProductsWithStock();
  }, [token]);

  //Permet de mettre à jour la catégorie et filtrer les articles en fonction
  const handleCategorie = (categorie) => {
    const listArticles = listProductSave;

    if (categorie !== "") {
      const filteredListArticles = listArticles.filter(
        (article) => article.categorie.name === categorie
      );
      setListProduct(filteredListArticles);
    } else {
      setListProduct(listArticles);
    }
  };

  return (
    <>
      <div className="page-shop">
        <div className="title-page">Boutique</div>

        <Filter handleCategorie={handleCategorie} />
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
      </div>
    </>
  );
};

export default Shop;
