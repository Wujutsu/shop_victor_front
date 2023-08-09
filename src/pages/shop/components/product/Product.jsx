import React, { useContext, useEffect, useState } from "react";
import "./Product.scss";
import { UserContext } from "../../../../contexts/UserContext";

const Product = ({ info }) => {
  const [img, setImg] = useState("");
  const { handleAddCartItem } = useContext(UserContext);

  useEffect(() => {
    const convertDataImg = () => {
      // Convertir la chaîne de données d'image en un tableau d'octets
      const byteCharacters = atob(info.listPicture[0]);

      // Convertir le tableau d'octets en un tableau d'octets sans signe
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      // Créer un objet Blob à partir du tableau d'octets
      const blob = new Blob([byteArray], { type: "image/png" });

      // Créer une URL blob à partir de l'objet Blob
      const imgUrl = URL.createObjectURL(blob);

      // Définir l'URL blob en tant qu'état d'image
      setImg(imgUrl);
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
