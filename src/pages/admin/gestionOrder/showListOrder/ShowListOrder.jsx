import axios from "axios";
import React, { useContext } from "react";
import { AiOutlineFieldTime, AiOutlineCheckCircle } from "react-icons/ai";
import { RiMailSendLine } from "react-icons/ri";
import { UserContext } from "../../../../contexts/UserContext";

const ShowListOrder = ({ listOrder, setListOrder }) => {
  const { token } = useContext(UserContext);

  //Met à jour l'état de la commande
  const updateStateOrder = (id) => {
    updateStateDisabledBtnOrder(id, true);

    const apiUrl = "http://localhost:3000/api/order/treatment/" + id;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .put(apiUrl, config)
      .then((response) => {
        const updateListOrder = listOrder.filter((order) => order.id !== id);

        setListOrder(updateListOrder);
      })
      .catch((error) => {
        updateStateDisabledBtnOrder(id, false);
      });
  };

  //Permet de disabled ou non un bouton
  const updateStateDisabledBtnOrder = (id, disabledState) => {
    const updateListOrder = listOrder.map((order) => {
      if (order.id === id) {
        return { ...order, disabled: disabledState };
      }
      return { ...order };
    });
    setListOrder(updateListOrder);
  };

  return (
    <>
      {listOrder.map((order, index) => (
        <div key={index}>
          <div className={`list-order ${order.disabled && "bg-color"}`}>
            <div className="global">
              <div className="state">
                {order.state === 0 && (
                  <>
                    <AiOutlineFieldTime size={25} /> En attente de traitement
                  </>
                )}

                {order.state === 1 && (
                  <>
                    <RiMailSendLine size={20} /> En attente d'envoi
                  </>
                )}

                {order.state === 2 && (
                  <>
                    <AiOutlineFieldTime size={25} /> Commande validée
                  </>
                )}
              </div>
              <div>
                <span className="bold">Date:</span> {order.orderDate}
              </div>
              <div>
                <span className="bold">E-mail:</span> {order.email}
              </div>
              <div>
                <span className="bold">Téléphone:</span> +{order.phoneNumber}
              </div>
              <div>
                <span className="bold">Prix total:</span> {order.totalAmount}
                &nbsp;€
              </div>
            </div>
            <div className="row">
              <div className="box-info col-lg-4 col-md-6 col-sm-6">
                <div className="info">
                  <div className="bold">Adresse de livraison:</div>
                  <div>{order.address.identity}</div>
                  <div>
                    {order.address.number} {order.address.address}
                  </div>
                  <div>
                    {order.address.codePostal} {order.address.city} -{" "}
                    {order.address.country}
                  </div>
                </div>

                {order.state === 0 && (
                  <button
                    className="btn btn-primary mb-3"
                    disabled={order.disabled}
                    onClick={() => updateStateOrder(order.id)}
                  >
                    <AiOutlineCheckCircle size={24} />
                    <div>Commande traitée</div>
                  </button>
                )}

                {order.state === 1 && (
                  <button
                    className="btn btn-primary mb-3"
                    disabled={order.disabled}
                    onClick={() => updateStateOrder(order.id)}
                  >
                    <AiOutlineCheckCircle size={24} />
                    <div>Commande envoyée</div>
                  </button>
                )}
              </div>

              {order.productList.map((product, key) => (
                <div key={key} className="box-img col-lg-2 col-md-3 col-sm-6">
                  <div className="product">
                    <div
                      className="picture"
                      style={{ backgroundImage: `url(${product.picture})` }}
                    ></div>
                    <div className="title-product">{product.name}</div>
                    <div className="quantity">Quantité: {product.quantity}</div>
                    <div className="price">Prix: {product.price}&nbsp;€</div>
                    {product.optionName !== null && (
                      <div className="firstName">
                        Prénom: {product.optionName}
                      </div>
                    )}
                    {product.optionFabric !== null && (
                      <div className="option-fabric">
                        <div
                          className="picture-fabric"
                          style={{
                            backgroundImage: `url(${product.optionFabric.picture})`,
                          }}
                        ></div>
                        <div>{product.optionFabric.name}</div>
                      </div>
                    )}
                    {product.optionName === null &&
                      product.optionFabric === null && (
                        <div className="option-none">
                          Aucune personnalisation
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {order.disabled && (
              <div className="loading-update-state">
                <div
                  className="spinner-grow spin-1 text-primary m-1"
                  role="status"
                ></div>
                <div
                  className="spinner-grow spin-2 text-primary m-1"
                  role="status"
                ></div>
                <div
                  className="spinner-grow spin-3 text-primary m-1"
                  role="status"
                ></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ShowListOrder;
