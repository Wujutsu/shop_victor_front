import React, { useContext, useEffect, useState } from "react";
import "./Product.scss";
import { UserContext } from "../../../../contexts/UserContext";
import { convertDataImg } from "../../../../utils/functionUtils";
import { NavLink } from "react-router-dom";

const Product = ({ info }) => {
  const [img, setImg] = useState("");
  const { handleAddCartItem } = useContext(UserContext);

  useEffect(() => {
    setImg(convertDataImg(info.listPicture[0]));
  }, [info.listPicture]);

  return (
    <div className="product">
      <div className="product-box">
        <NavLink
          to={`/shop/product/${info.id}`}
          aria-label="redirectInfoProduct"
        >
          <div
            className="picture"
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        </NavLink>
        <div className="infos">
          <div className="title">{info.name}</div>
          <div>
            <div className="price">{info.price.toFixed(2)}&nbsp;€</div>
            <div className="quantity">
              {/**  {info.stockQuantity > 0 ? (
                <>x{info.stockQuantity} en stock</>
              ) : (
                <>Stock épuisé</>
              )}*/}
            </div>
          </div>
        </div>

        {info.stockQuantity > 0 ? (
          <>
            <button
              disabled={false}
              className="btn btn-success"
              onClick={() =>
                handleAddCartItem(
                  info.id,
                  info.categorie.name,
                  info.name,
                  info.price
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
  );
};

export default Product;
