import React, { useState } from "react";
import "./Register.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorSignup, setErrorSignup] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const apiUrl = "http://localhost:8080/api/auth/signup";
    const requestData = {
      username: firstName + " " + lastName,
      email: email,
      password: password,
    };

    axios
      .post(apiUrl, requestData)
      .then((response) => {
        setErrorSignup("");
        navigate("/login");
      })
      .catch((error) => {
        let message = error.response.data.message;
        if (message === "Error: Username is already use") {
          setErrorSignup("Le nom d'utilisateur est déjà utilisé");
        } else if (message === "Error: Email is already use") {
          setErrorSignup("L'adresse E-mail est déjà utilisée");
        }
      });
  };

  return (
    <div className="register-container">
      <div className="register-title">Créer un compte</div>

      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-input">
          <label htmlFor="Prénom">Prénom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-input">
          <label htmlFor="Nom">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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

        {errorSignup !== "" && (
          <div className="signup-error">{errorSignup}</div>
        )}

        <button className="btn" type="submit" aria-label="S'enregistrer">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;
