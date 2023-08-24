import React, { useEffect, useState } from "react";
import "./ResetPassword.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorUpdatePassword, setErrorUpdatePassword] = useState("ok");

  useEffect(() => {
    const gestionToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenUrl = urlParams.get("token");

      if (tokenUrl) {
        const tokenValide = await verificationTokenExisting(tokenUrl);

        if (tokenValide) {
          setToken(tokenUrl);
          setShowForm(true);
        } else {
          navigate("/404");
        }
      } else {
        navigate("/404");
      }
    };

    gestionToken();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Permet de vérifier la validité d'un token
  const verificationTokenExisting = (tokenUrl) => {
    const apiUrl =
      "https://cozy-lunchroom-production.up.railway.app/api/user/verif/token/" +
      tokenUrl;

    return new Promise((success, failed) => {
      axios.get(apiUrl).then((response) => {
        success(response.data);
      });
    });
  };

  //Permet de changer le mot de passe
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    let authorizationUpdate = true;

    if (newPassword.length < 8) {
      authorizationUpdate = false;
      setErrorUpdatePassword(
        "Votre mot de passe doit contenir au moins 8 caractères"
      );
    }

    if (newPassword !== confirmPassword) {
      authorizationUpdate = false;
      setErrorUpdatePassword("Les mots de passe ne correspondent pas");
    }

    if (authorizationUpdate) {
      const apiUrl =
        "https://cozy-lunchroom-production.up.railway.app/api/user/update/password/token";
      const requestData = {
        password: newPassword,
        token: token,
      };

      axios
        .put(apiUrl, requestData)
        .then((response) => {
          if (response.data) {
            localStorage.setItem("passwordUpdateSuccess", true);
            navigate("/login");
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="reset-password">
      {showForm && (
        <form className="reset-password-form" onSubmit={handleUpdatePassword}>
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrorUpdatePassword("ok");
            }}
            required
          />

          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorUpdatePassword("ok");
            }}
            required
          />

          <div
            className={`identif-error  ${
              errorUpdatePassword !== "ok" ? "visible" : "invisible"
            }`}
          >
            {errorUpdatePassword}
          </div>

          <button className="btn btn-success" type="submit">
            Valider
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
