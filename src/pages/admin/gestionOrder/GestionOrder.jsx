import React, { useContext, useEffect, useState } from "react";
import "./GestionOrder.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import { formatTimestamp, convertDataImg } from "../../../utils/functionUtils";
import { AiOutlineFieldTime, AiOutlineCheckCircle } from "react-icons/ai";

const GestionOrder = () => {
  const { token } = useContext(UserContext);
  const [listOrder, setListOrder] = useState([]);

  useEffect(() => {
    const getAllOrder = () => {
      const apiUrl = "http://localhost:8080/api/order/all";
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
            };
          });

          console.log("ORDER => ", updateListOrder);

          setListOrder(updateListOrder);
        })
        .catch((error) => {});
    };

    getAllOrder();
  }, [token]);

  return (
    <div className="gestion-order">
      <h2>Gestion commandes</h2>
      {listOrder.map((order, index) => (
        <div key={index}>
          <div className="list-order">
            <div className="global">
              <div className="state">
                <AiOutlineFieldTime size={25} /> En attente de traitement
              </div>
              <div>
                <span className="bold">Date:</span> {order.orderDate}
              </div>
              <div>
                <span className="bold">E-mail:</span> {order.email}
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
                  <div> {order.address.identity}</div>
                  <div> {order.address.address}</div>
                  <div>
                    {order.address.codePostal} {order.address.city} -{" "}
                    {order.address.country}
                  </div>
                </div>
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
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-dark">
              <AiOutlineCheckCircle size={24} />
              <div>Commande prête</div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GestionOrder;
