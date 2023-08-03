import React, { useContext, useEffect, useState } from "react";
import "./Shop.scss";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import "./components/product/Product";
import Product from "./components/product/Product";

const Shop = () => {
  const { token } = useContext(UserContext);
  const [listProduct, setListProduct] = useState([]);

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
          console.log(response.data);
          setListProduct(response.data);
        })
        .catch((error) => {});
    };

    getAllProducts();
  }, [token, setListProduct]);

  return (
    <div className="">
      <div className="row">
        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}

        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}

        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}
        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}
        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}
        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}
        {listProduct.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            <Product info={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
