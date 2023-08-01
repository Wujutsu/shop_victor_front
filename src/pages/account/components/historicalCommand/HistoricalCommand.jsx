import React from "react";
import "./HistoricalCommand.scss";
import teeshirt from "../../../../assets/teeshirt.jpg";

const HistoricalCommand = () => {
  return (
    <div className="historicalCommand">
      <div className="recap-title">Vos dernières commandes</div>

      {[0, 1, 2, 3, 4].map((data, index) => (
        <div className="command" key={index}>
          <div>
            <div className="state">Votre commande a été expédiée</div>
            <div className="date">
              Date de commande: <span>25 nov. 2022</span>
            </div>
            <div className="cost">
              Coût total: <span>105.66 €</span>
            </div>
          </div>

          <div>
            <img src={teeshirt} alt="teeshirt" width={75} />
            <img src={teeshirt} alt="teeshirt" width={75} />
            <img src={teeshirt} alt="teeshirt" width={75} />
            <img src={teeshirt} alt="teeshirt" width={75} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalCommand;
