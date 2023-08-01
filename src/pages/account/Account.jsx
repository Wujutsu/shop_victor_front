import React, { useContext } from "react";
import "./Account.scss";
import HistoricalCommand from "./components/historicalCommand/HistoricalCommand";
import Profil from "./components/profil/Profil";
import { UserContext } from "../../contexts/UserContext";

const Account = () => {
  const { username } = useContext(UserContext);

  return (
    <div className="account">
      <div className="title">Mon compte</div>
      <div className="welcome">Bonjour {username}</div>
      <div className="row">
        <div className="col-lg-6">
          <HistoricalCommand />
        </div>
        <div className="col-lg-6">
          <Profil />
        </div>
      </div>
    </div>
  );
};

export default Account;
