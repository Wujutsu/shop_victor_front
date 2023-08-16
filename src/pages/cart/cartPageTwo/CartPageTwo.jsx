import React from "react";
import "./CartPageTwo.scss";
import Address from "./address/Address";
import Resume from "./resume/Resume";
import Paiement from "./paiement/Paiement";

const CartPageTwo = () => {
  return (
    <div className="cart-page-two">
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-12">
              <Address />
            </div>

            <div className="col-12">
              <Paiement />
            </div>
          </div>
        </div>

        <div className="col-md-5 col-sm-7">
          <Resume />
        </div>
      </div>
    </div>
  );
};

export default CartPageTwo;
