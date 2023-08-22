import React, { useContext, useEffect, useState } from "react";
import "./ProductDetails.scss";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import { convertDataImg } from "../../utils/functionUtils";

const ProductDetails = () => {
  const { productId } = useParams();
  const { token, handleAddCartItem } = useContext(UserContext);
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    const dataInfoProduct = () => {
      const apiUrl = "http://localhost:8080/api/product/info/" + productId;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .get(apiUrl, config)
        .then((response) => {
          const updateInfoProduct = {
            ...response.data,
            listPicture: convertDataImg(response.data.listPicture[0]),
            description: response.data.description.replace(/\n/g, "<br>"),
          };
          setProductInfo(updateInfoProduct);
          console.log("data => ", updateInfoProduct);
        })
        .catch((error) => {
          console.log("error => ", error);
        });
    };

    dataInfoProduct();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="product-details">
      <div className="row">
        <div className="col-lg-4 col-md-5 block-img">
          <div
            className="picture"
            style={{ backgroundImage: `url(${productInfo.listPicture})` }}
          ></div>
        </div>

        <div className="col-lg-8 col-md-7 block-info">
          <div className="contenu">
            <div className="title">{productInfo.name}</div>
            <div className="price">
              58 €
              <div className="stock">
                {productInfo.stockQuantity !== 0 ? (
                  <>(x{productInfo.stockQuantity} en stock)</>
                ) : (
                  <>(Stock épuisé)</>
                )}
              </div>
            </div>
            <div className="description">
              <div
                dangerouslySetInnerHTML={{ __html: productInfo.description }}
              />
            </div>
          </div>

          <div className="add-cart">
            <NavLink to="/shop" aria-label="redirectShop">
              <button className="btn btn-dark">Boutique</button>
            </NavLink>

            {productInfo.stockQuantity > 0 ? (
              <>
                {" "}
                <button
                  disabled={false}
                  className="btn btn-success"
                  onClick={() =>
                    handleAddCartItem(
                      productInfo.id,
                      productInfo.categorie.name,
                      productInfo.name,
                      productInfo.price
                    )
                  }
                >
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
  );
};

export default ProductDetails;
