import React, { useContext, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import ShowInfoPopup from "../../../../../components/showInfoPopup/ShowInfoPopup";
import { UserContext } from "../../../../../contexts/UserContext";
import axios from "axios";

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorPayment, setErrorPayment] = useState("");
  const { email, token, cartItem, totalCommandItem } = useContext(UserContext);

  // Permet d'envoyer les données de la CB pour valider ou non le paiement par stripe
  const handleSubmit = async (e) => {
    e.preventDefault();

    //On vérifie si la commande est possible
    const validationArticle = await handleVerifCommandPossible();

    if (!stripe || !elements || !validationArticle) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success/payment`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorPayment(error.message);
    } else {
      setErrorPayment("Une erreur inattendue s'est produite.");
    }

    setTimeout(() => {
      setErrorPayment("");
    }, 5000);
  };

  //Permet de vérifier que le prix à payer et la quantité de produit en stock est valide
  const handleVerifCommandPossible = () => {
    const apiUrl = "http://localhost:8080/api/order/verif";

    const requestData = {
      email: email,
      productList: cartItem,
      totalAmount: totalCommandItem,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    return new Promise((success, failed) => {
      axios
        .post(apiUrl, requestData, config)
        .then((response) => {
          success(true);
        })
        .catch((error) => {
          const msgError = error.response.data;

          if (msgError.includes("Insufficient stock")) {
            const item = msgError.split(": ")[1];
            setErrorPayment("Stock insuffisant pour: " + item);
          } else if (msgError.includes("Invalid total price for the order")) {
            setErrorPayment(
              "Le prix des articles ne corresponds pas au prix total de la commande"
            );
          }

          setTimeout(() => {
            setErrorPayment("");
          }, 3000);

          success(false);
        });
    });
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          className="btn btn-primary mt-3"
          disabled={!stripe || !elements}
          id="submit"
        >
          Payer
        </button>
      </form>

      {errorPayment !== "" && (
        <ShowInfoPopup msg={errorPayment} type="error"></ShowInfoPopup>
      )}
    </>
  );
};

export default StripePayment;
