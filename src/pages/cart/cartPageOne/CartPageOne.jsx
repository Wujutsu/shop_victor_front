import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import axios from "axios";
import "./CartPageOne.scss";
import Spinner from "../../../components/spinner/Spinner";
import { convertDataImg } from "../../../utils/functionUtils";
import { useNavigate } from "react-router-dom";

const CartPageOne = () => {
  const {
    cartItem,
    setCartItem,
    token,
    nbCartItem,
    setNbCartItem,
    handleAddCartItem,
    handleDeleteCartItem,
    totalCommandItem,
    setTotalCommandItem,
  } = useContext(UserContext);
  const [showCartItem, setShowCartItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStock, setErrorStock] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getPictureProducts = () => {
      if (cartItem !== null && cartItem.length > 0) {
        const apiUrl = "http://localhost:8080/api/product/picture";

        let requestData = [];
        cartItem.forEach((item, index) => {
          requestData.push({ id: item.id });
        });

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        axios
          .post(apiUrl, requestData, config)
          .then((response) => {
            let sommeItem = 0;

            //Permet d'afficher l'image des produits
            const updatedCartItems = cartItem.map((item) => {
              sommeItem += item.price * item.quantity;

              const matchingResponseItem = response.data.find(
                (itemResponse) => itemResponse.id === item.id
              );
              return matchingResponseItem
                ? {
                    ...item,
                    picture: convertDataImg(matchingResponseItem.picture),
                  }
                : item;
            });

            setTotalCommandItem(sommeItem);
            setShowCartItem(updatedCartItems);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
          });
      } else {
        setTotalCommandItem("0");
      }
    };

    getPictureProducts();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Permet de rediriger l'utilisateur sur la page suivante d'achat et de vérifier la disponibilité des stock
  const handleGoToPayement = () => {
    // /cart/paiement

    const apiUrl = "http://localhost:8080/api/product/verif";

    let requestData = cartItem;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(apiUrl, requestData, config)
      .then((response) => {
        const productListStockError = response.data;

        //Si il y a un probleme avec les stocks d'un ou plusieurs produit
        if (productListStockError.length > 0) {
          let sommeItem = 0;
          let quantityItem = 0;

          //On fait un tableau des produits à stock insuffisant
          const productListStockErrorFormat = productListStockError.map(
            (item) => {
              return fctRecupNameQuantiy(item);
            }
          );

          //On crée une variable pour mettre à jour cartItem avec les correctifs
          const updateCartItem = showCartItem
            .map((item) => {
              const matchingErrorItem = productListStockErrorFormat.find(
                (itemError) => item.id === itemError.id
              );

              if (matchingErrorItem) {
                if (matchingErrorItem.stock === 0) {
                  return null;
                } else {
                  sommeItem += item.price * matchingErrorItem.stock;
                  quantityItem += matchingErrorItem.stock;
                  return { ...item, quantity: matchingErrorItem.stock };
                }
              } else {
                sommeItem += item.price * item.quantity;
                quantityItem += item.quantity;
                return { ...item };
              }
            })
            .filter((filterItem) => filterItem !== null);

          setNbCartItem(parseInt(quantityItem));
          setTotalCommandItem(sommeItem);

          //Met à jour le panier des produits sur la page en gardant l'image
          setShowCartItem(updateCartItem);

          //Met à jour le panier des produits dans localStorage sans l'image (pour ne pas surcharger)
          const updateCartItemOutPicture = updateCartItem.map(
            ({ picture, ...rest }) => rest
          );
          setCartItem(updateCartItemOutPicture);

          //Message d'erreur pour informer l'utilisateur
          setErrorStock(
            "La quantité de certains produits de votre panier à été mise à jour car indisponible en stock 😓"
          );
        }
        //Si il n'y a pas de probleme avec la quantité des stocks des produits dans le panier
        else {
          navigate("/cart/paiement");
        }
      })
      .catch((error) => {
        //Le prix d'un article du panier ne correspond pas au prix de l'article en temps réel
        if (error.response.data === "Error: Price article invalid") {
          setNbCartItem(0);
          setTotalCommandItem(0);
          setShowCartItem([]);
          setCartItem([]);

          //Message d'erreur pour informer l'utilisateur
          setErrorStock("Une erreur est survenue 😫");
        }
      });
  };

  //Fonction permettant de récupérer le nom du produit et le stock quand celui si est insuffisant
  const fctRecupNameQuantiy = (str) => {
    const regex = /^([^(]+)\s+\((\d+)\s+en stock\)/;
    const matches = str.match(regex);

    if (matches) {
      const productId = matches[1].trim();
      const stockQuantity = parseInt(matches[2]);

      return { id: productId, stock: stockQuantity };
    }
  };

  //Permet de modifier les quantités d'un item sans avoir à recharger les images
  const handleUpdateItem = (id, type) => {
    let sommeItem = 0;

    const updatedCartItems = showCartItem
      .map((item) => {
        if (item.id === id) {
          if (type === "add") {
            item.quantity += 1;
          } else {
            item.quantity -= 1;
          }
        }

        sommeItem += item.price * item.quantity;
        return { ...item };
      })
      .filter((item) => item.quantity > 0);

    setTotalCommandItem(sommeItem);
    setShowCartItem(updatedCartItems);
  };

  //Permet de delete les items sans avoir à recharger les images
  const deleteCartItem = (id) => {
    handleDeleteCartItem(id);
    handleUpdateItem(id, "delete");
  };

  //Permet d'ajouter un item sans avoir à recharger les images
  const addCartItem = (id, categorie, name, price) => {
    handleAddCartItem(id, categorie, name, price);
    handleUpdateItem(id, "add");
  };

  return (
    <div>
      {errorStock !== "" && <div className="error-stock">{errorStock}</div>}
      <div className="card">
        <div className="row">
          <div className="col-lg-8 col-md-7 cart">
            <div className="title">
              <div className="row">
                <div className="col">
                  <h4>
                    <b>Panier d'achat</b>
                  </h4>
                </div>
              </div>
            </div>

            {isLoading && cartItem.length > 0 && <Spinner page={false} />}

            {nbCartItem > 0 &&
              showCartItem.map((item, index) => (
                <div
                  key={index}
                  className="row space-article border-top border-bottom"
                >
                  <div className="row align-items-center">
                    <div className="col-sm-2">
                      <div
                        className="picture"
                        style={{ backgroundImage: `url(${item.picture})` }}
                      ></div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row text-muted">
                        <div className="categorie">{item.categorie}</div>
                      </div>
                      <div className="row">
                        <div className="name">{item.name}</div>
                      </div>
                    </div>
                    <div className="col-sm-4 price-quantity">
                      <div className="price">
                        {(item.price * item.quantity).toFixed(2)}&nbsp;€
                      </div>
                      <div className="quantity">
                        <button
                          className="btn-quantity"
                          onClick={() => deleteCartItem(item.id)}
                        >
                          -
                        </button>
                        <input
                          className="show-quantity"
                          type="text"
                          disabled
                          value={item.quantity}
                          autoComplete="off"
                        />
                        <button
                          className="btn-quantity"
                          onClick={() =>
                            addCartItem(
                              item.id,
                              item.categorie,
                              item.name,
                              item.price
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {(nbCartItem === "0" || nbCartItem === 0) && (
              <div>Votre panier est vide ! 😕</div>
            )}
          </div>
          <div className="col-lg-4 col-md-5">
            <div className="summary">
              <div>
                <h5>
                  <b>Total commande</b>
                </h5>
              </div>
              <div className="row total-item">
                <div className="col" style={{ paddingLeft: "10px" }}>
                  {nbCartItem} {nbCartItem > 1 ? "articles" : "article"}
                </div>
                <div className="col t-right">
                  {parseFloat(totalCommandItem).toFixed(2)}&nbsp;€
                </div>
              </div>
              <div className="row total-item">
                <div className="col" style={{ paddingLeft: "10px" }}>
                  Livraison
                </div>
                <div className="col t-right">0.00&nbsp;€</div>
              </div>
              <form>
                <p>Code réduction</p>
                <input disabled id="code" placeholder="" autoComplete="off" />
              </form>
              <div className="row total-cost">
                <div className="col">Prix total</div>
                <div className="col t-right">
                  {parseFloat(totalCommandItem).toFixed(2)}&nbsp;€
                </div>
              </div>

              {cartItem.length > 0 ? (
                <button
                  className="btn btn-dark"
                  onClick={() => handleGoToPayement()}
                >
                  Continuer
                </button>
              ) : (
                <button className="btn btn-dark" disabled={true}>
                  Continuer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageOne;
