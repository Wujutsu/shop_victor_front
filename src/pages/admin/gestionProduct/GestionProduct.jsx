import React, { useContext, useEffect, useState } from "react";
import "./GestionProduct.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import Spinner from "../../../components/spinner/Spinner";
import { convertDataImg } from "../../../utils/imageUtils";
import { BsPen } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineCheckCircle } from "react-icons/ai";

const GestionProduct = () => {
  const { token } = useContext(UserContext);
  const [saveListProduct, setSaveListProduct] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
              urlPicture: convertDataImg(item.listPicture[0]),
              isDisabled: true,
            };
          });

          console.log("KEV => ", updatedCartItems);
          setListProduct(updatedCartItems);
          setSaveListProduct(updatedCartItems);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllProducts();
  }, [token]);

  //Permet de undisabled un item pour modifier des élements
  const handleDisabledFalse = (index) => {
    const unDisabledProduct = saveListProduct.map((item, i) => {
      if (i === index) {
        return { ...item, isDisabled: false };
      }
      return { ...item, isDisabled: true };
    });

    setListProduct(unDisabledProduct);
  };

  //Annule tous les changements
  const handleDisabledTrue = () => {
    setListProduct(saveListProduct);
  };

  //Permet de modifier les champs d'un produit
  const handleInputChange = (index, field, value) => {
    const updatedListProduct = listProduct.map((item, i) => {
      if (index === i) {
        return { ...item, [field]: value };
      } else {
        return { ...item };
      }
    });

    setListProduct(updatedListProduct);
  };

  //Permet de modifier la quantité en stock d'un produit
  const handleQuantityChange = (index, typeIncre) => {
    const updatedListProduct = listProduct.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          stockQuantity:
            typeIncre === "+"
              ? parseInt(item.stockQuantity) + 1
              : parseInt(item.stockQuantity) - 1,
        };
      } else {
        return { ...item };
      }
    });

    setListProduct(updatedListProduct);
  };

  return (
    <div className="gestion-product">
      <h2>Gestion des Produits</h2>

      <div className="row">
        {listProduct.length > 0 &&
          !isLoading &&
          listProduct.map((item, index) => (
            <div key={index} className="col-lg-6">
              <div className="list-product">
                {item.isDisabled ? (
                  <button
                    className="btn btn-disabled btn-dark"
                    onClick={() => handleDisabledFalse(index)}
                    aria-label="Editer"
                  >
                    <BsPen size={25} />
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-disabled btn-danger"
                      onClick={() => handleDisabledTrue()}
                      aria-label="Annuler modification"
                    >
                      <RxCrossCircled size={25} />
                    </button>

                    <button
                      className="btn btn-update btn-success"
                      onClick={() => handleDisabledFalse(index)}
                      aria-label="Confirmer modification"
                    >
                      <AiOutlineCheckCircle size={25} />
                    </button>
                  </>
                )}

                <div className="row">
                  <div className="col-sm-3">
                    <div className="info-detail">
                      <img
                        className="img-fluid"
                        src={item.urlPicture || ""}
                        alt={`item ${index}`}
                      />
                      <div className="price-quantity">
                        <div className="price">
                          <input
                            type="text"
                            value={item.price}
                            onChange={(e) =>
                              handleInputChange(index, "price", e.target.value)
                            }
                            disabled={item.isDisabled}
                          />
                          <span>€</span>
                        </div>
                        <div className="quantity">
                          <button
                            className="btn-quantity"
                            onClick={() => handleQuantityChange(index, "-")}
                          >
                            -
                          </button>
                          <input
                            className="show-quantity"
                            type="text"
                            disabled={item.isDisabled}
                            value={item.stockQuantity}
                            autoComplete="off"
                          />
                          <button
                            className="btn-quantity"
                            onClick={() => handleQuantityChange(index, "+")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-9">
                    <div className="info-product">
                      <div className="row mb-2">
                        <div className="categorie">
                          <div className="label">Catégorie:</div>
                          <input
                            type="text"
                            value={item.categorie.name}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "categorie",
                                e.target.value
                              )
                            }
                            disabled={item.isDisabled}
                          />
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="name">
                          <div className="label">Nom:</div>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            disabled={item.isDisabled}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="label">Description:</div>
                        <div className="description">
                          <textarea
                            name="descriptionText"
                            id="descriptionText"
                            cols="30"
                            rows="3"
                            value={item.description}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            disabled={item.isDisabled}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {isLoading && <Spinner />}
    </div>
  );
};

export default GestionProduct;
