import React from "react";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>Oups !</h1>
      <h2>404 - Page non trouvée</h2>
      <p>
        Nous sommes désolés, mais la page que vous recherchez semble
        introuvable.
      </p>
    </div>
  );
};

export default NotFound;
