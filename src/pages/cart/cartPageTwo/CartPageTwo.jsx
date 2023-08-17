import React, { useState } from "react";
import "./CartPageTwo.scss";
import Address from "./address/Address";
import Resume from "./resume/Resume";
import Payment from "./payment/Payment";
import Spinner from "../../../components/spinner/Spinner";

const CartPageTwo = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="cart-page-two">
      {isLoading && <Spinner fixed={true} point={false} />}

      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-12">
              <Address />
            </div>

            <div className="col-12">
              <Payment setIsLoading={setIsLoading} />
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
