import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";

const Cart = () => {
  const { cartItem, token } = useContext(UserContext);

  useEffect(() => {
    const getAllProducts = () => {
      if (cartItem !== null && cartItem.length > 0) {
        const apiUrl = "http://localhost:8080/api/product/picture";

        let requestData = [];
        cartItem.forEach((item, index) => {
          requestData.push({ id: item.id });
        });

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        axios
          .post(apiUrl, requestData, config)
          .then((response) => {
            console.log("Recup image => ", response.data);
          })
          .catch((error) => {});
      }
    };

    getAllProducts();
  }, [cartItem, token]);

  return <div>test</div>;
};

export default Cart;
