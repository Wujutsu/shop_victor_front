import React, { useContext, useEffect, useState } from "react";
import "./HistoricalCommand.scss";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";
import Spinner from "../../../../components/spinner/Spinner";
import {
  formatTimestamp,
  convertDataImg,
} from "../../../../utils/functionUtils";
import FacturePdf from "../facturePdf/FacturePdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFileInvoice } from "react-icons/fa";

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
            const updateProductList = order.productList.map((product) => {
              let updateOptionFabric = null;
              if (product.optionFabric !== null) {
                updateOptionFabric = {
                  ...product.optionFabric,
                  picture: convertDataImg(product.optionFabric.picture),
                };
              }

              return {
                ...product,
                picture: convertDataImg(product.picture),
                optionFabric: updateOptionFabric,
              };
            });

            return {
              ...order,
              orderDate: formatTimestamp(order.orderDate),
              productList: updateProductList,
            };
          });

          console.log("Kevn => ", updateListOrder);

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
          <div className="nocommand">Aucun article commandé 😧</div>
        </div>
      )}

      {listCommand.map((order, index) => (
        <div className="command" key={index}>
          <PDFDownloadLink
            document={<FacturePdf order={order} />}
            fileName="facture.pdf"
          >
            <button className="btn btn-primary btn-facture">
              <FaFileInvoice size={18} /> Facture
            </button>
          </PDFDownloadLink>

          <div>
            <div className="state">
              {order.state === 0 && <>En attente de traitement</>}
              {order.state === 1 && <>En attente d'envoi</>}
              {order.state === 2 && <>Commande envoyée</>}
            </div>

            <div className="date">
              Commandé le: <span>{order.orderDate}</span>
            </div>
            <div className="cost">
              Prix total:{" "}
              <span>
                {parseFloat(order.totalAmount) +
                  parseFloat(order.delivery.price)}
                &nbsp;€
              </span>
            </div>
          </div>

          <div className="row">
            {order.productList.map((product, key) => (
              <div key={key} className="col-xl-12">
                <div className="show-product">
                  <div
                    className="picture"
                    style={{ backgroundImage: `url(${product.picture})` }}
                  ></div>

                  <div className="detail">
                    <div className="info">
                      {product.name} <span>(x{product.quantity})</span>
                    </div>
                    <div className="info">
                      Prix: <span>{product.price}&nbsp;€</span>
                    </div>
                    {product.optionName !== null && (
                      <div className="info">
                        Prénom: <span>{product.optionName}</span>
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
