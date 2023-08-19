import React, { useContext, useEffect, useState } from "react";
import "./GestionOrder.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import { formatTimestamp, convertDataImg } from "../../../utils/functionUtils";
import { AiOutlineFieldTime, AiOutlineCheckCircle } from "react-icons/ai";
import { RiMailSendLine } from "react-icons/ri";
import Spinner from "../../../components/spinner/Spinner";

const GestionOrder = () => {
  const { token } = useContext(UserContext);
  const [filterState, setFilterState] = useState(0);
  const [listOrder, setListOrder] = useState([]);
  const [nbOrderByState, setNbOrderByState] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCountOrdersByState = () => {
      const apiUrl = "http://localhost:8080/api/order/nb";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          setNbOrderByState(response.data);
        })
        .catch((error) => {});
    };

    getCountOrdersByState();
  }, [token, filterState, listOrder]);

  useEffect(() => {
    const getAllOrder = () => {
      setIsLoading(true);

      const apiUrl = "http://localhost:8080/api/order/all/" + filterState;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const updateListOrder = response.data.map((order) => {
            const updateProductList = order.productList.map((product) => {
              return { ...product, picture: convertDataImg(product.picture) };
            });

            return {
              ...order,
              orderDate: formatTimestamp(order.orderDate),
              productList: updateProductList,
              disabled: false,
            };
          });

          console.log("ORDER => ", updateListOrder);

          setListOrder(updateListOrder);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllOrder();
  }, [token, filterState]);

  //Met à jour l'état de la commande
  const updateStateOrder = (id) => {
    updateStateDisabledBtnOrder(id, true);

    const apiUrl = "http://localhost:8080/api/order/treatment/" + id;
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
        console.log("error => ", error);
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
    <div className="gestion-order">
      <h2>Gestion commandes</h2>

      <div className="filtre">
        <button
          onClick={() => setFilterState(0)}
          className={`btn ${
            filterState === 0 ? "btn-dark" : "btn-outline-dark"
          }`}
        >
          <AiOutlineFieldTime size={25} /> A&nbsp;traiter{" "}
          {nbOrderByState[0] ? " (" + nbOrderByState[0] + ")" : "(0)"}
        </button>
        <button
          onClick={() => setFilterState(1)}
          className={`btn margin-left ${
            filterState === 1 ? "btn-dark" : "btn-outline-dark"
          }`}
        >
          <RiMailSendLine size={22} />
          A&nbsp;envoyer{" "}
          {nbOrderByState[1] ? " (" + nbOrderByState[1] + ")" : "(0)"}
        </button>
        <button
          onClick={() => setFilterState(2)}
          className={`btn margin-left ${
            filterState === 2 ? "btn-dark" : "btn-outline-dark"
          }`}
        >
          <AiOutlineCheckCircle size={25} />
          Validé {nbOrderByState[2] ? " (" + nbOrderByState[2] + ")" : "(0)"}
        </button>
      </div>

      {isLoading ? (
        <Spinner page={false} />
      ) : (
        <>
          {listOrder.map((order, index) => (
            <div key={index}>
              <div className={`list-order ${order.disabled && "bg-color"}`}>
                <div className="global">
                  <div className="state">
                    {order.state === 0 && (
                      <>
                        <AiOutlineFieldTime size={25} /> En attente de
                        traitement
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
                    <span className="bold">Prix total:</span>{" "}
                    {order.totalAmount}
                    &nbsp;€
                  </div>
                </div>
                <div className="row">
                  <div className="box-info col-lg-4 col-md-6 col-sm-6">
                    <div className="info">
                      <div className="bold">Adresse de livraison:</div>
                      <div>{order.address.identity}</div>
                      <div>{order.address.address}</div>
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
                    <div
                      key={key}
                      className="box-img col-lg-2 col-md-3 col-sm-6"
                    >
                      <div className="product">
                        <div
                          className="picture"
                          style={{ backgroundImage: `url(${product.picture})` }}
                        ></div>
                        <div className="title-product">{product.name}</div>
                        <div className="quantity">
                          Quantité: {product.quantity}
                        </div>
                        <div className="price">
                          Prix: {product.price}&nbsp;€
                        </div>
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
      )}
    </div>
  );
};

export default GestionOrder;
