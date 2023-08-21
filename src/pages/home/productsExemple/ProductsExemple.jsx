import React from "react";
import "./ProductsExemple.scss";

const ProductsExemple = () => {
  return (
    <section className="list-products">
      <div className="row">
        {["aze", "e", "ee", "ze"].map((item, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div className="product-box">
              <div className="picture">
                <div className="text">Categorie</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsExemple;
