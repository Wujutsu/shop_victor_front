import React, { useContext, useEffect, useState } from "react";
import "./Product.scss";
import { UserContext } from "../../../../contexts/UserContext";
import { convertDataImg } from "../../../../utils/imageUtils";

const Product = ({ info }) => {
  const [img, setImg] = useState("");
  const { handleAddCartItem } = useContext(UserContext);

  useEffect(() => {
    setImg(convertDataImg(info.listPicture[0]));
  }, [info.listPicture]);

  return (
    <div className="product">
      <div className="product-box">
        <div
          className="picture"
          style={{ backgroundImage: `url(${img})` }}
        ></div>
        <div className="infos">
          <div className="title">{info.name} collection</div>
          <div>
            <div className="price">{info.price} €</div>
            <div className="quantity">x{info.stockQuantity} en stock</div>
          </div>
        </div>

        <button
          className="btn btn-dark"
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
      </div>
    </div>
  );
};

export default Product;
