import React, { useEffect, useState } from "react";
import "./Product.scss";

const Product = ({ info }) => {
  const [img, setImg] = useState("");

  useEffect(() => {
    const convertDataImg = () => {
      return setImg(`data:image/png;base64,${info.listPicture[0]}`);
    };

    convertDataImg();
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
          <div className="quantity">x{info.stockQuantity} en stock</div>
          <div className="price">{info.price} €</div>
        </div>
      </div>
    </div>
  );
};

export default Product;
