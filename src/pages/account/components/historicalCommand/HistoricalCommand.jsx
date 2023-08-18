import React, { useContext, useEffect, useState } from "react";
import "./HistoricalCommand.scss";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";
import Spinner from "../../../../components/spinner/Spinner";
import {
  formatTimestamp,
  convertDataImg,
} from "../../../../utils/functionUtils";

const HistoricalCommand = () => {
  const { token } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [listCommand, setListCommand] = useState([]);

  useEffect(() => {
    //Récupére les commandes de l'utilisateur connecté
    const getCommandUser = () => {
      const apiUrl = "http://localhost:8080/api/order/email";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          //Permet de formatter les infos
          const updateListOrder = response.data.map((order) => {
            const updateListProduct = order.productList.map((product) => {
              return { ...product, picture: convertDataImg(product.picture) };
            });

            return {
              ...order,
              orderDate: formatTimestamp(order.orderDate),
              productList: updateListProduct,
            };
          });

          console.log("Order =>", updateListOrder);

          setListCommand(updateListOrder);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getCommandUser();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="historicalCommand">
      <div className="recap-title">Historique des commandes</div>

      {isLoading && <Spinner page={false} point={true} />}

      {!isLoading && listCommand.length === 0 && (
        <div className="command">
          <div className="nocommand">Aucun article commandé 😢</div>
        </div>
      )}

      {listCommand.map((order, index) => (
        <div className="command" key={index}>
          <div>
            <div className="state">
              {order.state === 0 && <>Commande en attente de traitement</>}
              {order.state === 1 && <>Commande expédiée</>}
              {order.state === 2 && <>Commande annulée</>}
            </div>

            <div className="date">
              Commandé le: <span>{order.orderDate}</span>
            </div>
            <div className="cost">
              Prix total: <span>{order.totalAmount}&nbsp;€</span>
            </div>
          </div>

          <div className="row">
            {order.productList.map((product, key) => (
              <div key={key} className="col-xl-6">
                <div className="show-product">
                  <img src={product.picture} alt="teeshirt" width={80} />
                  <div className="detail">
                    <div className="info">{product.name}</div>
                    <div className="info">
                      Quantité: <span>{product.quantity}</span>
                    </div>
                    <div className="info">
                      Prix: <span>{product.price}&nbsp;€</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalCommand;
