import React, { useEffect, useState } from "react";
import "./ProductsExemple.scss";
import axios from "axios";
import { convertDataImg } from "../../../utils/functionUtils";
import { NavLink } from "react-router-dom";

const ProductsExemple = () => {
  const [listProducts, setListProducts] = useState([]);

  useEffect(() => {
    const recupProductToShow = () => {
      const apiUrl = "http://localhost:8080/api/product/all/presentation";

      axios
        .get(apiUrl)
        .then((response) => {
          const updateListProducts = response.data.map((prod) => {
            return {
              ...prod,
              picture: convertDataImg(prod.listPicture[0]),
            };
          });
          setListProducts(updateListProducts);
        })
        .catch((error) => {});
    };

    recupProductToShow();
  }, []);

  return (
    <section className="list-products">
      <div className="row justify-content-center">
        {listProducts.length > 0 ? (
          <>
            {listProducts.map((product, index) => (
              <div key={index} className="col-sm-6 col-md-3">
                <NavLink
                  to={`/shop?category=${product.categorie.name}`}
                  aria-label="redirectHome"
                >
                  <div className="product-box">
                    <div
                      className="picture"
                      style={{
                        backgroundImage: `linear-gradient(
                  rgba(0, 0, 0, 0.1),
                  rgba(0, 0, 0, 0.3)
                ), url(${product.picture})`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundImage = `linear-gradient(
                    rgba(0, 0, 0, 0.1),
                    rgba(0, 0, 0, 0.1)
                  ), url(${product.picture})`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundImage = `linear-gradient(
                    rgba(0, 0, 0, 0.1),
                    rgba(0, 0, 0, 0.3)
                  ), url(${product.picture})`;
                      }}
                    >
                      <div className="box-text">
                        <div className="text">{product.categorie.name}</div>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="col-sm-6 col-md-3">
              <div className="product-box">
                <div className="picture-wait"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductsExemple;
