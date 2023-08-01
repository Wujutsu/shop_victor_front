import React, { createContext, useEffect, useState } from "react";

// Création du contexte
const UserContext = createContext();

// Créez un composant de contexte pour envelopper votre application
const UserProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  //Récupére les données sauvegardées en local lors du chargement initial du composant
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    const savedRole = localStorage.getItem("role");
    const savedisLogged = localStorage.getItem("isLogged");

    if (savedToken && savedUsername && savedRole && savedisLogged) {
      setToken(savedToken);
      setUsername(savedUsername);
      setRole(savedRole);
      setIsLogged(savedisLogged === "true");
    }
  }, []);

  //Permet de sauvegarder les données de l'utilisateur en local chaque fois qu'elles sont mises à jour
  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("isLogged", isLogged);
  }, [token, username, role, isLogged]);

  const handleSaveLogin = (token, username, role) => {
    setToken(token);
    setUsername(username);
    setRole(role);
    setIsLogged(true);
  };

  const handleSaveLogout = () => {
    setToken("");
    setUsername("");
    setRole("");
    setIsLogged(false);
  };

  const dataList = {
    token,
    username,
    role,
    isLogged,
    handleSaveLogin,
    handleSaveLogout,
  };

  return (
    <UserContext.Provider value={dataList}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
