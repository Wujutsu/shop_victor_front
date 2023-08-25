import React, { useContext, useEffect } from "react";
import "./SuccessPayment.scss";
import logo from "../../../assets/logo.webp";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import axios from "axios";

const SuccessPayment = () => {
  const {
    token,
    email,
    cartItem,
    totalCommandItem,
    addressOrder,
    handleEraseAfterOrder,
    setStripeClientSecret,
    phoneNumber,
    objectDelivery,
  } = useContext(UserContext);

  useEffect(() => {
    const createOrder = () => {
      const apiUrl = "https://mcfabric.netlify.app/api/order/add";

      const requestData = {
        email: email,
        productList: cartItem,
        totalAmount: totalCommandItem,
        address: addressOrder,
        phoneNumber: phoneNumber,
        state: 0,
        delivery: objectDelivery,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .post(apiUrl, requestData, config)
        .then((response) => {
          handleEraseAfterOrder();
          setTimeout(() => {
            setStripeClientSecret("");
          }, 5000);
        })
        .catch((error) => {
          handleEraseAfterOrder();
          setTimeout(() => {
            setStripeClientSecret("");
          }, 5000);
        });
    };

    createOrder();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="payment-success">
      <h1>Paiement réussi !</h1>
      <p>Merci pour votre achat.</p>
      <div>
        <img src={logo} alt="logo" width={120} />
      </div>

      <NavLink to="/shop" aria-label="redirectShop">
        <button className="btn btn-success">Retour</button>
      </NavLink>
    </div>
  );
};

export default SuccessPayment;
