import React from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();

  // Permet d'envoyer les données de la CB pour valider ou non le paiement par stripe
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      console.log(error.message);
    } else {
      console.log("Une erreur inattendue s'est produite.");
    }
  };

  return (
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
  );
};

export default StripePayment;
