import React, { useContext, useEffect, useState } from "react";
import "./Login.scss";
import axios from "axios";
import { UserContext } from "../../contexts/UserContext";
import { NavLink, useNavigate } from "react-router-dom";
import ShowInfoPopup from "../../components/showInfoPopup/ShowInfoPopup";

//TODO: Gérér les champs input dans ce qu'on peut mettre dedans surtout niveau adresse
//TODO: Ajouter mdp oublier et donc recup via mail
//TODO: Lorsque l'utilisateur a son token expiré, le déconnecter
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectIdentifier, setIncorrectIdentifier] = useState("");
  const navigate = useNavigate();
  const { handleSaveLogin } = useContext(UserContext);
  const [accountCreatedSuccess, setAccountCreatedSuccess] = useState(false);
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [isError, setIsError] = useState("");
  const [isGood, setIsGood] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [expirationSession, setExpirationSession] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accountCreatedSuccess")) {
      setAccountCreatedSuccess(true);
      localStorage.removeItem("accountCreatedSuccess");
    }

    if (localStorage.getItem("emailUpdated")) {
      setEmailUpdated(true);
      localStorage.removeItem("emailUpdated");
    }

    if (localStorage.getItem("passwordUpdateSuccess")) {
      setPasswordUpdated(true);
      localStorage.removeItem("passwordUpdateSuccess");
    }

    if (localStorage.getItem("expirationSession")) {
      setExpirationSession(true);
      localStorage.removeItem("expirationSession");
    }

    //Ici on vérifie si il y a un token valide pour permettre d'activer un compte
    const tokenVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenUrl = urlParams.get("token");

      if (tokenUrl) {
        const tokenValide = await verificationTokenExisting(tokenUrl);

        if (tokenValide) {
          const apiUrl =
            "http://localhost:8080/api/user/update/active-account/" + tokenUrl;

          axios
            .put(apiUrl)
            .then((response) => {
              console.log("PPPP=>", response.data);
              if (response.data) {
                setIsGood("Votre compte vient d'être activé");
                setTimeout(() => {
                  setIsGood("");
                }, 3000);
              }
            })
            .catch((error) => {});
        }
      }
    };

    tokenVerification();
  }, []);

  //Permet de vérifier la validité d'un token
  const verificationTokenExisting = (tokenUrl) => {
    const apiUrl = "http://localhost:8080/api/user/verif/token/" + tokenUrl;

    return new Promise((success, failed) => {
      axios.get(apiUrl).then((response) => {
        success(response.data);
      });
    });
  };

  //Permet d'envoyer les infos de connexion
  const handleLogin = (event) => {
    event.preventDefault();

    const apiUrl = "http://localhost:8080/api/auth/signin";
    const requestData = {
      email: email.toLowerCase(),
      password: password,
    };

    axios
      .post(apiUrl, requestData)
      .then((response) => {
        setIncorrectIdentifier("");
        handleSaveLogin(
          response.data.accessToken,
          response.data.firstName,
          response.data.lastName,
          response.data.email.toLowerCase(),
          response.data.phoneNumber,
          response.data.roles[0]
        );
        navigate("/");
      })
      .catch((error) => {
        if (error.response.data === "Account is not active") {
          setIsError("Vous n'avez pas encore activé votre compte");
          setTimeout(() => {
            setIsError("");
          }, 3000);
        } else {
          setIncorrectIdentifier("Identifiants incorrects");
        }
      });
  };

  //Permet d'envoyer un mail pour réinitialiser le mot de passe
  const handlePasswordForgot = () => {
    if (email === "") {
      setIncorrectIdentifier(
        "Veuillez renseigner votre e-mail pour réinitialiser le mot de passe"
      );
    } else {
      setIncorrectIdentifier("");

      const apiUrl = "http://localhost:8080/api/email/reset-password";
      const requestData = {
        to: email.toLowerCase(),
      };

      axios
        .post(apiUrl, requestData)
        .then((response) => {
          setIsGood("Un e-mail vient d'être envoyé à l'adresse " + email);
          setEmail("");
          setPassword("");
          setTimeout(() => {
            setIsGood("");
          }, 3000);
        })
        .catch((error) => {
          if (error.response.data === "Error: User not found") {
            setIsError("Aucun compte enregistré avec l'e-mail " + email);
            setTimeout(() => {
              setIsError("");
            }, 3000);
          }
        });
    }
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
            onChange={(e) => {
              setEmail(e.target.value);
              setIncorrectIdentifier("");
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
              setIncorrectIdentifier("");
            }}
            required
            autoComplete="off"
          />
        </div>

        {incorrectIdentifier !== "" && (
          <div className="identif-error">{incorrectIdentifier}</div>
        )}

        <button
          className="btn btn-success"
          type="submit"
          aria-label="Se connecter"
        >
          Se connecter
        </button>
      </form>
      <div className="option">
        <div className="forget-password" onClick={() => handlePasswordForgot()}>
          Mot de passe oublié
        </div>
        <NavLink to="/register" aria-label="redirectRegister">
          <div className="new-account">Créer un compte</div>
        </NavLink>
      </div>

      {accountCreatedSuccess && (
        <ShowInfoPopup
          msg="Un e-mail de confirmation vient de vous être envoyé pour activer votre compte"
          type="success"
        />
      )}

      {emailUpdated && (
        <ShowInfoPopup msg="Votre e-mail a été mis à jour" type="success" />
      )}

      {passwordUpdated && (
        <ShowInfoPopup
          msg="Votre mot de passe à été mis à jour"
          type="success"
        />
      )}

      {expirationSession && (
        <ShowInfoPopup msg="Votre session a expiré" type="success" />
      )}

      {isGood !== "" && <ShowInfoPopup msg={isGood} type="success" />}

      {isError !== "" && <ShowInfoPopup msg={isError} type="error" />}
    </div>
  );
};

export default Login;
