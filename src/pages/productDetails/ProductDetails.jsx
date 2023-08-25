import React, { useContext, useEffect, useState } from "react";
import "./ProductDetails.scss";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { convertDataImg } from "../../utils/functionUtils";
import NotFound from "../notFound/NotFound";
import { CgShoppingCart } from "react-icons/cg";
import { TbArrowBack } from "react-icons/tb";
import Spinner from "../../components/spinner/Spinner";
import ShowInfoPopup from "../../components/showInfoPopup/ShowInfoPopup";

const ProductDetails = () => {
  const { productId } = useParams();
  const { token, handleAddCartItem } = useContext(UserContext);
  const [productInfo, setProductInfo] = useState({});
  const [idProductError, setIdProductError] = useState(false);
  const [animationAddCart, setAnimationAddCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listFabric, setListFabric] = useState([]);
  const [inputName, setInputName] = useState("");
  const [nameFabricSelect, setNameFabricSelect] = useState("");
  const [showError, setShowError] = useState("");

  useEffect(() => {
    const dataInfoProduct = () => {
      const apiUrl = "http://localhost:3000/api/product/info/" + productId;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then(async (response) => {
          const updateInfoProduct = {
            ...response.data,
            listPicture: convertDataImg(response.data.listPicture[0]),
            description: response.data.description.replace(/\n/g, "<br>"),
          };
          setProductInfo(updateInfoProduct);

          if (updateInfoProduct.optionPersoFabric) {
            await getAllFabricList();
          }

          setIsLoading(false);
        })
        .catch((error) => {
          setIdProductError(true);
          setIsLoading(false);
        });
    };

    dataInfoProduct();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Récupére la liste des tissus si nécéssaire
  const getAllFabricList = () => {
    return new Promise((success, failed) => {
      const apiUrl = "http://localhost:3000/api/fabric/all";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const updateFabricList = response.data.map((tissu) => {
            return {
              ...tissu,
              pictureUrl: convertDataImg(tissu.picture),
              selected: false,
            };
          });
          setListFabric(updateFabricList);
          success();
        })
        .catch((error) => {
          success();
        });
    });
  };

  //Permet de sélectionner un tissu
  const handleSelectFabric = (id) => {
    const updateListFabric = listFabric.map((item) => {
      if (item.id === id) {
        item.selected === false
          ? setNameFabricSelect(item.name)
          : setNameFabricSelect("");

        return { ...item, selected: !item.selected };
      } else {
        return { ...item, selected: false };
      }
    });

    setListFabric(updateListFabric);
  };

  //On vérifie les éléments avant d'enregistrer dans le panier
  const handleAddCartItemVerificationBeforePush = (
    id,
    categorie,
    name,
    price
  ) => {
    if (productInfo.optionPersoName && productInfo.optionPersoFabric) {
      const verifFabricSelect = listFabric.find((fabric) => fabric.selected);

      if (verifFabricSelect === undefined && inputName.trim() === "") {
        setShowError("Veuillez sélectionner un tissu et renseigner un prénom");
      } else if (verifFabricSelect === undefined) {
        setShowError("Veuillez sélectionner un tissu");
      } else if (inputName.trim() === "") {
        setShowError("Veuillez sélectionner un prénom");
      } else {
        const fabricSelect = {
          id: verifFabricSelect.id,
          name: verifFabricSelect.name,
          picture: verifFabricSelect.picture,
        };
        handleAddCartItem(id, categorie, name, price, inputName, fabricSelect);
        handleAnimationAddCart();
        handleSelectFabric("");
        setNameFabricSelect("");
        setInputName("");
      }
    } else if (productInfo.optionPersoName) {
      if (inputName.trim() === "") {
        setShowError("Veuillez sélectionner un prénom");
      } else {
        handleAddCartItem(id, categorie, name, price, inputName);
        handleAnimationAddCart();
        setInputName("");
      }
    } else if (productInfo.optionPersoFabric) {
      const verifFabricSelect = listFabric.find((fabric) => fabric.selected);

      if (verifFabricSelect === undefined) {
        setShowError("Veuillez sélectionner un tissu");
      } else {
        const fabricSelect = {
          id: verifFabricSelect.id,
          name: verifFabricSelect.name,
          picture: verifFabricSelect.picture,
        };
        handleAddCartItem(id, categorie, name, price, "", fabricSelect);
        handleAnimationAddCart();
        handleSelectFabric("");
        setNameFabricSelect("");
      }
    } else {
      handleAddCartItem(id, categorie, name, price);
      handleAnimationAddCart();
    }

    setTimeout(() => {
      setShowError("");
    }, 3000);
  };

  //Fais une animation panier lorsqu'on ajoute l'item
  const handleAnimationAddCart = () => {
    setAnimationAddCart(true);
    setTimeout(() => {
      setAnimationAddCart(false);
    }, 800);
  };

  return (
    <>
      {!idProductError ? (
        <div className="product-details">
          {!isLoading ? (
            <div className="row">
              <div className="col-lg-4 col-md-5 block-img">
                <div
                  className="picture"
                  style={{ backgroundImage: `url(${productInfo.listPicture})` }}
                ></div>
              </div>

              <div className="col-lg-8 col-md-7 block-info">
                <div className="info">
                  <div className="title">{productInfo.name}</div>
                  <div className="price">
                    {productInfo.price}&nbsp;€
                    <div className="stock">
                      {/* {productInfo.stockQuantity !== 0 ? (
                      <>(x{productInfo.stockQuantity} en stock)</>
                    ) : (
                      <>(Stock épuisé)</>
                    )}*/}
                    </div>
                  </div>
                  <div className="description">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: productInfo.description,
                      }}
                    />
                  </div>

                  {(productInfo.optionPersoName ||
                    productInfo.optionPersoFabric) && (
                    <div className="option-personnalisation">
                      <div className="line"></div>
                      <div className="option-title">
                        Personnalise ton produit
                      </div>

                      <div className="row">
                        {productInfo.optionPersoFabric && (
                          <>
                            <div className="col-lg-6 col-md-12 col-sm-7">
                              <div className="form-input">
                                <label htmlFor="Tissu">
                                  Choisis un tissu:{" "}
                                  {nameFabricSelect !== "" && (
                                    <span>{nameFabricSelect}</span>
                                  )}
                                </label>

                                <div className="box-fabric">
                                  <div className="row">
                                    {listFabric.map((tissu, index) => (
                                      <div
                                        key={index}
                                        className="col-lg-2 col-md-2 col-sm-2 col-2"
                                      >
                                        <div
                                          className={`show-fabric ${
                                            tissu.selected
                                              ? "show-fabric-selected"
                                              : ""
                                          }`}
                                          style={{
                                            backgroundImage: `url(${tissu.pictureUrl})`,
                                          }}
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title={tissu.name}
                                          onClick={() =>
                                            handleSelectFabric(tissu.id)
                                          }
                                        ></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-1"></div>
                          </>
                        )}
                        {productInfo.optionPersoName && (
                          <div className="col-lg-5 col-md-12 col-sm-4">
                            <div className="form-input">
                              <label htmlFor="Prénom">Choisis un prénom:</label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                autoComplete="off"
                                required
                                maxLength={20}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="add-cart">
                  <div className="box-btn">
                    <NavLink to="/shop" aria-label="redirectShop">
                      <button className="btn btn-dark">
                        <TbArrowBack size={25} />
                      </button>
                    </NavLink>

                    {productInfo.stockQuantity > 0 ? (
                      <>
                        <button
                          disabled={false}
                          className="btn btn-success"
                          onClick={() => {
                            handleAddCartItemVerificationBeforePush(
                              productInfo.id,
                              productInfo.categorie.name,
                              productInfo.name,
                              productInfo.price
                            );
                          }}
                        >
                          <div
                            className={`cart-add-animation ${
                              animationAddCart ? "animation-start" : "d-none"
                            }`}
                          >
                            <CgShoppingCart size={20} color="white" />
                          </div>
                          Ajouter au panier
                        </button>
                      </>
                    ) : (
                      <>
                        <button disabled={true} className="btn btn-success">
                          Ajouter au panier
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Spinner page={false} />
          )}
        </div>
      ) : (
        <NotFound />
      )}

      {showError !== "" && <ShowInfoPopup msg={showError} type="error" />}
    </>
  );
};

export default ProductDetails;
