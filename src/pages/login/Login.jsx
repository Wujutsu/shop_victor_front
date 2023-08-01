import React, { useContext, useState } from "react";
import "./Login.scss";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectIdentifier, setIncorrectIdentifier] = useState(false);

  const { handleSaveLogin } = useContext(UserContext);

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
          response.data.username,
          response.data.roles[0]
        );
        console.log("Welcome " + response.data.username);
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

        <button className="btn" type="submit" aria-label="Se connecter">
          Se connecter
        </button>
      </form>

      <div className="new-account">Créer un compte</div>
    </div>
  );
};
