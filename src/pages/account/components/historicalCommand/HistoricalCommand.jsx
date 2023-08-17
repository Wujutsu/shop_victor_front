import React from "react";
import "./HistoricalCommand.scss";
import teeshirt from "../../../../assets/teeshirt.jpg";

const HistoricalCommand = () => {
  return (
    <div className="historicalCommand">
      <div className="recap-title">Vos dernières commandes</div>

      {[0, 1, 2].map((data, index) => (
        <div className="command" key={index}>
          <div>
            <div className="state">Votre commande a été expédiée</div>
            <div className="date">
              Date commande: <span>25 nov. 2022</span>
            </div>
            <div className="cost">
              Coût total: <span>105.66&nbsp;€</span>
            </div>
          </div>

          <div className="show-product">
            <img src={teeshirt} alt="teeshirt" width={80} />
            <div className="detail">
              <div className="info">Tee-shirt noir mate en laine arabique</div>
              <div className="info">
                Quantité: <span>1</span>
              </div>
              <div className="info">
                Coût: <span>50.99&nbsp;€</span>
              </div>
            </div>
          </div>
          <div className="show-product">
            <img src={teeshirt} alt="teeshirt" width={80} />
            <div className="detail">
              <div className="info">Tee-shirt noir mate en laine arabique</div>
              <div className="info">
                Quantité: <span>1</span>
              </div>
              <div className="info">
                Coût: <span>50.99&nbsp;€</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalCommand;
