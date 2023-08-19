import React, { useContext, useEffect, useState } from "react";
import "./GestionProduct.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import Spinner from "../../../components/spinner/Spinner";
import { convertDataImg, formatTarif } from "../../../utils/functionUtils";
import ShowCategory from "./showCategory/ShowCategory";
import ShowListProduct from "./showListProduct/ShowListProduct";
import AddProduct from "./addProduct/AddProduct";

//TODO: Permettre d'archiver des produits ???
const GestionProduct = () => {
  const { token } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [saveListProduct, setSaveListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModalNewProduct, setShowModalNewProduct] = useState(false);

  useEffect(() => {
    const getAllCategories = () => {
      const apiUrl = "http://localhost:8080/api/categorie/all";
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

    const getAllProducts = () => {
      const apiUrl = "http://localhost:8080/api/product/all";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const updatedCartItems = response.data.map((item) => {
            return {
              ...item,
              price: formatTarif(item.price),
              urlPicture: convertDataImg(item.listPicture[0]),
              isDisabled: true,
            };
          });

          console.log("ListProduct => ", updatedCartItems);
          setListProduct(updatedCartItems);
          setSaveListProduct(updatedCartItems);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllCategories();
    getAllProducts();
  }, [token]);

  return (
    <>
      {/* Liste des categories && ajout & suppression */}
      <ShowCategory categories={categories} setCategories={setCategories} />

      <div className="mt-4">
        <h2>Gestion produits</h2>
        <button
          className="btn btn-admin btn-primary mb-3"
          onClick={() => setShowModalNewProduct(true)}
        >
          Ajouter un produit
        </button>
        <div className="row">
          {/* Ajout un produit */}

          <AddProduct
            categories={categories}
            showModalNewProduct={showModalNewProduct}
            setShowModalNewProduct={setShowModalNewProduct}
            listProduct={listProduct}
            setListProduct={setListProduct}
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

        {isLoading && <Spinner />}
      </div>
    </>
  );
};

export default GestionProduct;
