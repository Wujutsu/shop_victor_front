import React from "react";
import {
  useStripe,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import "./StripePayment.scss";

const StripePayment = ({ options }) => {
  const stripe = useStripe();
  const elements = useElements();

  // Confirmer le paiement avec Stripe
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("in");

    const cardElement = elements.getElement(PaymentElement);

    if (!stripe || !cardElement) {
      console.log("FCK OFFF");
      return;
    }

    stripe
      .confirmCardPayment(options.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })
      .then((result) => {
        console.log("STRIPE - Paiement confirmé:", result.paymentIntent);
      })
      .catch((error) => {
        console.error("STRIPE - Erreur:", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe}>
          Payer
        </button>
      </form>

      {/*paymentIntent && (
        <div>
          <h2>Récapitulatif du paiement:</h2>
          <p>
            Montant: {paymentIntent.amount / 100}{" "}
            {paymentIntent.currency.toUpperCase()}
          </p>
          <p>Statut du paiement: {paymentIntent.status}</p>
        </div>
      )*/}
    </div>
  );
};

export default StripePayment;
