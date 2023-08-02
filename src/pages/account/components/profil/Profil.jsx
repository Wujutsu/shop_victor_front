import React, { useContext, useState } from "react";
import "./Profil.scss";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";

const Profil = () => {
  const { firstName, lastName, email, token, handleUpdateInfos, handleLogout } =
    useContext(UserContext);
  const [valFirstName, setValFirstName] = useState(firstName);
  const [valLastName, setValLastName] = useState(lastName);
  const [valEmail, setValEmail] = useState(email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifPassword, setVerifPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);

  const updateInformations = (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8080/api/user/update/info";
    const requestData = {
      firstName: valFirstName,
      lastName: valLastName,
      email: valEmail,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .put(apiUrl, requestData, config)
      .then((response) => {
        setErrorEmail(false);

        //Si le mail a été modifié, on déconnecte l'utilisateur
        if (email !== valEmail) {
          //TODO: afficher un popup regarder myprotein
          handleLogout();
        } else {
          //TODO: afficher un popup
          handleUpdateInfos(valFirstName, valLastName, valEmail);
        }
      })
      .catch((error) => {
        if (error.response.data === "Error: Email is already use") {
          //TODO: afficher un popup
          setErrorEmail(true);
        }
      });
  };

  const updatePassword = (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8080/api/user/update/password";
    const requestData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      verifPassword: verifPassword,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .put(apiUrl, requestData, config)
      .then((response) => {
        setOldPassword("");
        setNewPassword("");
        setVerifPassword("");
        setErrorPassword("");
        //TODO: afficher un popup regarder myprotein
      })
      .catch((error) => {
        if (error.response.data === "Error: incorrect old password") {
          //TODO: afficher un popup
          setErrorPassword("old");
        } else if (error.response.data === "Error: incorrect new password") {
          //TODO: afficher un popup
          setErrorPassword("new");
        }
      });
  };

  return (
    <div className="profil">
      <div className="title">Informations personnels</div>

      <div className="profil-box">
        <form className="profil-form" onSubmit={updateInformations}>
          <div className="form-input">
            <label htmlFor="Prénom">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={valFirstName}
              onChange={(e) => setValFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-input">
            <label htmlFor="Nom">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={valLastName}
              onChange={(e) => setValLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-input">
            <label htmlFor="email">E-mail</label>
            <input
              className={`${errorEmail && "input-error"}`}
              type="email"
              id="email"
              name="email"
              value={valEmail}
              onChange={(e) => setValEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            aria-label="UpdateInfos"
          >
            Modifier informations
          </button>
        </form>

        <form className="profil-form" onSubmit={updatePassword}>
          <div className="form-input">
            <label htmlFor="oldPassword">Ancien mot de passe</label>
            <input
              className={`${errorPassword === "old" && "input-error"}`}
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-input">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              className={`${errorPassword === "new" && "input-error"}`}
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-input">
            <label htmlFor="verifPassword">Confirmer</label>
            <input
              className={`${errorPassword === "new" && "input-error"}`}
              type="password"
              id="verifPassword"
              name="verifPassword"
              value={verifPassword}
              onChange={(e) => setVerifPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            aria-label="updatePassword"
          >
            Modifier mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profil;
