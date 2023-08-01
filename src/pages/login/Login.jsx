import React from "react";
import "./Login.scss";

export const Login = () => {
  return (
    <div class="login-container">
      <div class="login-title">Connexion</div>

      <form class="login-form" action="/login" method="post">
        <div class="form-input">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div class="form-input">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" name="password" required />
        </div>

        <button className="btn" type="submit">
          Se connecter
        </button>
      </form>

      <div className="new-account">Créer un compte</div>
    </div>
  );
};
