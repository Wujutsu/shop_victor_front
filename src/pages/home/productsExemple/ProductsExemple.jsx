import React from "react";
import "./ProductsExemple.scss";

const ProductsExemple = () => {
  return (
    <section className="list-products">
      <div className="row">
        {["Sac", "Chouchou", "Doudou", "ze"].map((item, index) => (
          <div key={index} className="col-md-3 col-sm-6">
            <div className="product-box">
              <div className="picture">
                <div className="box-text">
                  <div className="text">{item}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsExemple;
