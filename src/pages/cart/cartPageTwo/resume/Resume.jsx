import React, { useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";

const Resume = () => {
  const { totalCommandItem, nbCartItem } = useContext(UserContext);

  return (
    <div className="cart resume">
      <h4>
        <b>Résumé commande</b>
      </h4>

      <div className="row mb-2">
        <div className="col-8">
          {nbCartItem} {nbCartItem <= 1 ? "article" : "articles"}
        </div>
        <div className="col-4 text-right">
          {parseFloat(totalCommandItem).toFixed(2)} €
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-8">Livraison</div>
        <div className="col-4 text-right">5 €</div>
      </div>
      {/*<div className="row mb-2">
            <div className="col-8">Code réduction</div>
            <div className="col-4 text-right">-4.73 €</div>
</div>*/}
      <div className="border-bottom mb-2"></div>
      <div className="row">
        <div className="col-8">Total à payer</div>
        <div className="col-4 text-right">
          {(parseFloat(totalCommandItem) + 5).toFixed(2)} €
        </div>
      </div>
    </div>
  );
};

export default Resume;
