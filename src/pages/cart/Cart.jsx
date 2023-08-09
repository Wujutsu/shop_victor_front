import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import "./Cart.scss";
import Spinner from "../../components/spinner/Spinner";

const Cart = () => {
  const { cartItem, token } = useContext(UserContext);
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
              sommeItem += item.price;
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
      }
    };

    getAllProducts();
  }, [cartItem, token]);

  //Permet de convertir la data image en url pour la rendre visible
  const convertDataImg = (dataImg) => {
    // Convertir la chaîne de données d'image en un tableau d'octets
    const byteCharacters = atob(dataImg);

    // Convertir le tableau d'octets en un tableau d'octets sans signe
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    // Créer un objet Blob à partir du tableau d'octets
    const blob = new Blob([byteArray], { type: "image/png" });

    // Créer une URL blob à partir de l'objet Blob
    const imgUrl = URL.createObjectURL(blob);

    // Définir l'URL blob en tant qu'état d'image
    return imgUrl;
  };

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

          {isLoading && <Spinner page={false} />}

          {showCartItem.map((item, index) => (
            <div
              key={index}
              className="row space-article border-top border-bottom"
            >
              <div className="row align-items-center">
                <div className="col-sm-2">
                  <img className="img-fluid" src={item.picture} alt="Item 1" />
                </div>
                <div className="col-sm-6">
                  <div className="row text-muted">
                    <div className="categorie">
                      {item.categorie} (x {item.quantity})
                    </div>
                  </div>
                  <div className="row">
                    <div className="name">{item.name}</div>
                  </div>
                </div>
                <div className="col-sm-4 price">{item.price.toFixed(2)} €</div>
              </div>
            </div>
          ))}
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
                3 articles
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
              <input disabled id="code" placeholder="" />
            </form>
            <div className="row total-cost">
              <div className="col">Prix total</div>
              <div className="col t-right">
                {totalCommandDelivery.toFixed(2)} €
              </div>
            </div>
            <button className="btn btn-dark">Continuer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
