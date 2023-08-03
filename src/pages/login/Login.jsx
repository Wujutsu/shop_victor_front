import React, { useContext, useEffect, useState } from "react";
import "./Login.scss";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { NavLink, useNavigate } from "react-router-dom";
import ShowInfoPopup from "../../components/showInfoPopup/ShowInfoPopup";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectIdentifier, setIncorrectIdentifier] = useState(false);
  const navigate = useNavigate();
  const { handleSaveLogin } = useContext(UserContext);
  const [accountCreatedSuccess, setAccountCreatedSuccess] = useState(false);
  const [emailUpdated, setEmailUpdated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accountCreatedSuccess")) {
      setAccountCreatedSuccess(true);
      localStorage.removeItem("accountCreatedSuccess");
    }

    if (localStorage.getItem("emailUpdated")) {
      setEmailUpdated(true);
      localStorage.removeItem("emailUpdated");
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();

    const apiUrl = "http://localhost:8080/api/auth/signin";
    const requestData = {
      email: email,
      password: password,
    };

    axios
      .post(apiUrl, requestData)
      .then((response) => {
        setIncorrectIdentifier(false);
        handleSaveLogin(
          response.data.accessToken,
          response.data.firstName,
          response.data.lastName,
          response.data.email,
          response.data.phoneNumber,
          response.data.roles[0]
        );
        navigate("/");
      })
      .catch((error) => {
        setIncorrectIdentifier(true);
      });
  };

  return (
    <div className="login-container">
      <div className="login-title">Connexion</div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-input">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-input">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {incorrectIdentifier && (
          <div className="identif-error">Identifiants incorrects</div>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          aria-label="Se connecter"
        >
          Se connecter
        </button>
      </form>

      <NavLink to="/register" aria-label="redirectRegister">
        <div className="new-account">Créer un compte</div>
      </NavLink>

      {accountCreatedSuccess && (
        <ShowInfoPopup
          msg="Votre compte a été créé avec succès !"
          type="success"
        />
      )}

      {emailUpdated && (
        <ShowInfoPopup msg="Votre e-mail a été mis à jour" type="success" />
      )}
    </div>
  );
};

export default Login;
