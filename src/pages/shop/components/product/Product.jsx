import React, { useContext, useEffect, useState } from "react";
import "./Product.scss";
import { UserContext } from "../../../../contexts/UserContext";
import { convertDataImg } from "../../../../utils/functionUtils";
import { NavLink } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";

const Product = ({ info }) => {
  const [img, setImg] = useState("");
  const [imgBis, setImgBis] = useState("");
  const { handleAddCartItem } = useContext(UserContext);
  const [animationAddCart, setAnimationAddCart] = useState(false);

  useEffect(() => {
    const img1 = convertDataImg(info.listPicture[0]);
    setImg(img1);
    if (info.listPicture[1]) {
      setImgBis(convertDataImg(info.listPicture[1]));
    } else {
      setImgBis(img1);
    }
  }, [info.listPicture]);

  const handleAnimationAddCart = () => {
    setAnimationAddCart(true);
    setTimeout(() => {
      setAnimationAddCart(false);
    }, 800);
  };

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
          <div
            className="pictureBis"
            style={{ backgroundImage: `url(${imgBis})` }}
          >
            <div className="show-product"></div>
          </div>
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

        <div className="box-btn">
          {info.stockQuantity > 0 ? (
            <>
              {info.optionPersoName === false &&
              info.optionPersoFabric === false ? (
                <button
                  disabled={false}
                  className="btn btn-success"
                  onClick={() => {
                    handleAddCartItem(
                      info.id,
                      info.categorie.name,
                      info.name,
                      info.price
                    );
                    handleAnimationAddCart();
                  }}
                >
                  <div
                    className={`cart-add-animation ${
                      animationAddCart ? "animation-start" : "d-none"
                    }`}
                  >
                    <CgShoppingCart size={20} color="white" />
                  </div>
                  Ajouter au panier
                </button>
              ) : (
                <NavLink
                  to={`/shop/product/${info.id}`}
                  aria-label="redirectInfoProduct"
                >
                  <button disabled={false} className="btn btn-success">
                    <div
                      className={`cart-add-animation ${
                        animationAddCart ? "animation-start" : "d-none"
                      }`}
                    >
                      <CgShoppingCart size={20} color="white" />
                    </div>
                    Personnaliser
                  </button>
                </NavLink>
              )}
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
  );
};

export default Product;
