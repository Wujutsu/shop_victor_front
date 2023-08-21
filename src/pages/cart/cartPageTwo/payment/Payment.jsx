import React, { useContext, useEffect } from "react";
import StripePayment from "./stripePayment/StripePayment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { UserContext } from "../../../../contexts/UserContext";

const stripePromise = loadStripe(
  "pk_test_51NZgpADKTTYZVfPmdjut3v8ytT3ztpbfMlntbHpf31FMw2nHlwm2HPO5sjpcPwRWpTU4gSVhsDINcrf9VQeIQY7d00lEZxvmEw"
);

const Payment = ({ setIsLoading }) => {
  const {
    token,
    totalCommandItem,
    nbCartItem,
    cartItem,
    stripeClientSecret,
    setStripeClientSecret,
    addressOrder,
    phoneNumber,
  } = useContext(UserContext);

  useEffect(() => {
    //Permet de créer l'intention de paiement (ce que doit payer l'utilisateur)
    const createPaymentIntent = () => {
      setStripeClientSecret("");
      const apiUrl = "http://localhost:8080/api/payment/create";

      const requestData = {
        amount: parseFloat(totalCommandItem) * 100,
        currency: "eur",
        description:
          nbCartItem > 1 ? nbCartItem + " articles" : nbCartItem + " article",
        metadata: cartItem.map(({ id, ...rest }) => rest),
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
          setStripeClientSecret({
            clientSecret: response.data.clientSecret,
          });
        })
        .catch((error) => {
          console.error("Error creation payment intent:", error);
          setStripeClientSecret("");
        });
    };

    createPaymentIntent();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="cart-paiement">
      {addressOrder !== undefined && phoneNumber.length > 10 && (
        <div className="cart">
          <h4>
            <b>2. Moyen de paiement</b>
          </h4>

          <div className="row">
            <div className="col-12">
              {stripeClientSecret !== "" && (
                <Elements stripe={stripePromise} options={stripeClientSecret}>
                  <StripePayment setIsLoading={setIsLoading} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
