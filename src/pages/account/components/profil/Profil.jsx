import React, { useContext, useState } from "react";
import "./Profil.scss";
import { UserContext } from "../../../../contexts/UserContext";
import axios from "axios";
import ShowInfoPopup from "../../../../components/showInfoPopup/ShowInfoPopup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Profil = () => {
  const {
    firstName,
    lastName,
    email,
    token,
    phoneNumber,
    handleUpdateInfos,
    handleLogout,
  } = useContext(UserContext);
  const [valFirstName, setValFirstName] = useState(firstName);
  const [valLastName, setValLastName] = useState(lastName);
  const [valEmail, setValEmail] = useState(email);
  const [valPhoneNumber, setValPhoneNumber] = useState(phoneNumber);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifPassword, setVerifPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [updatedInformations, setUpdatedInformations] = useState(false);

  const updateInformations = (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8080/api/user/update/info";
    const requestData = {
      firstName: valFirstName,
      lastName: valLastName,
      phoneNumber: valPhoneNumber,
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
        //Si le mail a été modifié, on déconnecte l'utilisateur
        if (email !== valEmail) {
          localStorage.setItem("emailUpdated", true);
          handleLogout();
        } else {
          handleUpdateInfos(valFirstName, valLastName, valPhoneNumber);
          setUpdatedInformations(true);
          setTimeout(() => {
            setUpdatedInformations(false);
          }, 3000);
        }
      })
      .catch((error) => {
        if (error.response.data === "Error: Email is already use") {
          setErrorEmail(true);
          setTimeout(() => {
            setErrorEmail(false);
          }, 3000);
        }
      });
  };

  const updatePassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setErrorPassword("length");
    } else {
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
          setErrorPassword("success");
        })
        .catch((error) => {
          if (error.response.data === "Error: incorrect old password") {
            setErrorPassword("old");
          } else if (error.response.data === "Error: incorrect new password") {
            setErrorPassword("new");
          }
        });
    }

    setTimeout(() => {
      setErrorPassword("");
    }, 3000);
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              disabled={true}
              required
            />
          </div>
          <div className="form-phone">
            <label htmlFor="phoneNumber">Téléphone</label>
            <PhoneInput
              country={"fr"}
              value={valPhoneNumber}
              onChange={(valPhoneNumber) => setValPhoneNumber(valPhoneNumber)}
              placeholder=""
            />
          </div>
          <button
            className="btn btn-dark"
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              required
            />
          </div>

          <button
            className="btn btn-dark"
            type="submit"
            aria-label="updatePassword"
          >
            Modifier mot de passe
          </button>
        </form>
      </div>

      {updatedInformations && (
        <ShowInfoPopup
          msg="Vos informations ont été mises à jour"
          type="success"
        ></ShowInfoPopup>
      )}

      {errorEmail && (
        <ShowInfoPopup
          msg="L'e-mail est déjà utilisé par un autre compte"
          type="error"
        ></ShowInfoPopup>
      )}

      {errorPassword === "length" && (
        <ShowInfoPopup
          msg="Votre mot de passe doit contenir au moins 8 caractères"
          type="error"
        ></ShowInfoPopup>
      )}

      {errorPassword === "old" && (
        <ShowInfoPopup
          msg='Votre "ancien" mot de passe est incorrect'
          type="error"
        ></ShowInfoPopup>
      )}

      {errorPassword === "new" && (
        <ShowInfoPopup
          msg="Les mots de passe ne correspondent pas"
          type="error"
        ></ShowInfoPopup>
      )}

      {errorPassword === "success" && (
        <ShowInfoPopup
          msg="Votre mot de passe a été mis à jour"
          type="success"
        ></ShowInfoPopup>
      )}
    </div>
  );
};

export default Profil;
