import React, { useContext } from "react";
import "./Account.scss";
import HistoricalCommand from "./components/historicalCommand/HistoricalCommand";
import Profil from "./components/profil/Profil";
import { UserContext } from "../../contexts/UserContext";

const Account = () => {
  const { firstName } = useContext(UserContext);

  return (
    <div className="account dimension-page">
      <div className="title">Mon compte</div>
      <div className="welcome">Bonjour {firstName}</div>
      <div className="row">
        <div className="col-md-6">
          <Profil />
        </div>
        <div className="col-md-6">
          <HistoricalCommand />
        </div>
      </div>
    </div>
  );
};

export default Account;