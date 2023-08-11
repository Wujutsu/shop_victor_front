import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import "./Cart.scss";
import Spinner from "../../components/spinner/Spinner";
import { convertDataImg } from "../../utils/imageUtils";

const Cart = () => {
  const {
    cartItem,
    token,
    nbCartItem,
    handleAddCartItem,
    handleDeleteCartItem,
  } = useContext(UserContext);
  const [showCartItem, setShowCartItem] = useState([]);
  const [totalCommandItem, setTotalCommandItem] = useState(0);
  const [totalCommandDelivery, setTotalCommandDelivery] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllProducts = () => {
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
            setTotalCommandDelivery(sommeItem + 5);
            setShowCartItem(updatedCartItems);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
          });
      } else {
        setTotalCommandItem(0);
        setTotalCommandDelivery(0);
      }
    };

    getAllProducts();
  }, [cartItem, token]);

  return (
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
                    <img
                      className="img-fluid"
                      src={item.picture}
                      alt="Item 1"
                    />
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
                      {(item.price * item.quantity).toFixed(2)} €
                    </div>
                    <div className="quantity">
                      <button
                        className="btn-quantity"
                        onClick={() => handleDeleteCartItem(item.id)}
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
                          handleAddCartItem(
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
            <h5>Votre panier est vide !</h5>
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
              <div className="col t-right">{totalCommandItem.toFixed(2)} €</div>
            </div>
            <div className="row total-item">
              <div className="col" style={{ paddingLeft: "10px" }}>
                Livraison
              </div>
              <div className="col t-right">5.00 €</div>
            </div>
            <form>
              <p>Code réduction</p>
              <input disabled id="code" placeholder="" autoComplete="off" />
            </form>
            <div className="row total-cost">
              <div className="col">Prix total</div>
              <div className="col t-right">
                {totalCommandDelivery.toFixed(2)} €
              </div>
            </div>
            <button
              className="btn btn-dark"
              disabled={cartItem.length > 0 ? false : true}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
