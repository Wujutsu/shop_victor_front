import React, { useContext, useEffect, useState } from "react";
import "./GestionProduct.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import Spinner from "../../../components/spinner/Spinner";
import { convertDataImg, formatTarif } from "../../../utils/functionUtils";
import ShowCategory from "./showCategory/ShowCategory";
import ShowListProduct from "./showListProduct/ShowListProduct";
import AddProduct from "./addProduct/AddProduct";
import Paging from "./showListProduct/paging/Paging";
import FilterProduct from "./filterProduct/FilterProduct";
import ShowInfoPopup from "../../../components/showInfoPopup/ShowInfoPopup";

const GestionProduct = () => {
  const { token } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [saveListProduct, setSaveListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModalNewProduct, setShowModalNewProduct] = useState(false);
  const [filterPage, setFilterPage] = useState(0);
  const [filterCategorie, setFilterCategorie] = useState("all");
  const [filterStock, setFilterStock] = useState("empty");
  const [filterPrice, setFilterPrice] = useState("empty");
  const [msgError, setMsgError] = useState("");

  //Récupére les catégories
  useEffect(() => {
    const getAllCategories = () => {
      const apiUrl = "https://mcfabric.netlify.app/api/categorie/all";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {});
    };

    getAllCategories();
  }, [token]);

  //Récupére les produits
  useEffect(() => {
    const getAllProducts = () => {
      const filterQuantityMinToShow = 0;
      const apiUrl =
        "https://mcfabric.netlify.app/api/product/all/" +
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
          console.log("??? => ", response.data);

          const updatedCartItems = response.data.map((item) => {
            return {
              ...item,
              price: formatTarif(item.price),
              urlPicture: convertDataImg(item.listPicture[0]),
              isDisabled: true,
            };
          });

          setListProduct(updatedCartItems);
          setSaveListProduct(updatedCartItems);
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

    getAllProducts();
  }, [token, filterPage, filterCategorie, filterStock, filterPrice]);

  return (
    <>
      {/* Liste des categories && ajout & suppression */}
      <ShowCategory categories={categories} setCategories={setCategories} />

      <div className="mt-4">
        <h2>Gestion produits</h2>

        {/* Filtre les produits */}
        <FilterProduct
          categories={categories}
          setFilterCategorie={setFilterCategorie}
          filterStock={filterStock}
          setFilterStock={setFilterStock}
          filterPrice={filterPrice}
          setFilterPrice={setFilterPrice}
          setFilterPage={setFilterPage}
        />

        <button
          className="btn btn-admin btn-primary mb-3"
          onClick={() => setShowModalNewProduct(true)}
        >
          Ajouter un produit
        </button>

        {isLoading && <Spinner page={false} />}

        <div className="row">
          {/* Ajout un produit */}

          <AddProduct
            categories={categories}
            showModalNewProduct={showModalNewProduct}
            setShowModalNewProduct={setShowModalNewProduct}
            listProduct={listProduct}
            setListProduct={setListProduct}
            setSaveListProduct={setSaveListProduct}
          />

          {/* Liste des produits && update */}
          <ShowListProduct
            listProduct={listProduct}
            setListProduct={setListProduct}
            saveListProduct={saveListProduct}
            setSaveListProduct={setSaveListProduct}
            categories={categories}
            isLoading={isLoading}
          />
        </div>

        {/* Permet de changer de page  */}
        <Paging
          filterPage={filterPage}
          setFilterPage={setFilterPage}
          filterCategorie={filterCategorie}
        />

        {msgError !== "" && (
          <ShowInfoPopup msg={msgError} type="error"></ShowInfoPopup>
        )}
      </div>
    </>
  );
};

export default GestionProduct;
