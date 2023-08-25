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
  const [disabledBtn, setDisabledBtn] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorSignup("Votre mot de passe doit contenir au moins 8 caractères");
    } else {
      setDisabledBtn(true);

      const apiUrl = "http://localhost:3000/api/auth/signup";
      const requestData = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      };

      axios
        .post(apiUrl, requestData)
        .then((response) => {
          localStorage.setItem("accountCreatedSuccess", true);
          navigate("/login");
          setDisabledBtn(false);
        })
        .catch((error) => {
          let message = error.response.data.message;
          if (message === "Error: Email is already use") {
            setErrorSignup("L'adresse E-mail est déjà utilisée");
          }
          setDisabledBtn(false);
        });
    }
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        <div className="form-input">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorSignup("");
            }}
            required
            autoComplete="off"
          />
        </div>

        <div className="form-input">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorSignup("");
            }}
            required
            autoComplete="off"
          />
        </div>

        {errorSignup !== "" && (
          <div className="signup-error">{errorSignup}</div>
        )}

        <button
          disabled={disabledBtn}
          className="btn btn-success"
          type="submit"
          aria-label="S'enregistrer"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;
