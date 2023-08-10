import React, { useContext, useEffect, useState } from "react";
import "./GestionProduct.scss";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
import Spinner from "../../../components/spinner/Spinner";
import { convertDataImg } from "../../../utils/imageUtils";

const GestionProduct = () => {
  const { token } = useContext(UserContext);
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
          console.log("Data=>", response.data);

          const updatedCartItems = response.data.map((item) => {
            return { ...item, urlPicture: convertDataImg(item.listPicture[0]) };
          });

          console.log("KEV => ", updatedCartItems);
          setListProduct(updatedCartItems);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    getAllProducts();
  }, [token]);

  return (
    <div className="gestion-product">
      <h2>Gestion des Produits</h2>

      {listProduct.length > 0 &&
        !isLoading &&
        listProduct.map((item, index) => (
          <div
            key={index}
            className="row space-article border-top border-bottom"
          >
            <div className="row">
              <div className="col-sm-2">
                <img className="img-fluid" src={item.urlPicture} alt="Item 1" />
              </div>
              <div className="col-sm-6">
                <div className="row text-muted">
                  <div className="categorie">{item.categorie.name}</div>
                </div>
                <div className="row">
                  <div className="name">{item.name}</div>
                </div>
                <div className="row">
                  <div className="description"></div>
                </div>
              </div>
              <div className="col-sm-4 price-quantity">
                <div className="price">{item.price} €</div>
                <div className="quantity">
                  <button className="btn-quantity">-</button>
                  <input
                    className="show-quantity"
                    type="text"
                    disabled
                    value={item.quantity}
                    autoComplete="off"
                  />
                  <button className="btn-quantity">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}

      {isLoading && <Spinner />}
    </div>
  );
};

export default GestionProduct;
