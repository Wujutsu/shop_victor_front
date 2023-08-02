import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Création du contexte
const UserContext = createContext();

// Créez un composant de contexte pour envelopper votre application
const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  //Récupére les données sauvegardées en local lors du chargement initial du composant
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedFirstName = localStorage.getItem("firstName");
    const savedLastName = localStorage.getItem("lastName");
    const savedEmail = localStorage.getItem("email");
    const savedRole = localStorage.getItem("role");
    const savedisLogged = localStorage.getItem("isLogged");

    if (
      savedToken &&
      savedFirstName &&
      savedLastName &&
      savedEmail &&
      savedRole &&
      savedisLogged
    ) {
      setToken(savedToken);
      setFirstName(savedFirstName);
      setLastName(savedLastName);
      setEmail(savedEmail);
      setRole(savedRole);
      setIsLogged(savedisLogged === "true");
    }
  }, []);

  //Permet de sauvegarder les données de l'utilisateur en local chaque fois qu'elles sont mises à jour
  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    localStorage.setItem("isLogged", isLogged);
  }, [token, firstName, lastName, email, role, isLogged]);

  const handleUpdateInfos = (firstName, lastName, email) => {
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
  };

  const handleSaveLogin = (token, firstName, lastName, email, role) => {
    setToken(token);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
    setRole(role);
    setIsLogged(true);
  };

  const handleLogout = () => {
    setToken("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
    setIsLogged(false);
    navigate("/login");
  };

  const dataList = {
    token,
    firstName,
    lastName,
    email,
    role,
    isLogged,
    handleUpdateInfos,
    handleSaveLogin,
    handleLogout,
  };

  return (
    <UserContext.Provider value={dataList}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
