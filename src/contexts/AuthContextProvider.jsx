import React, { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  // Vous pouvez ajouter les fonctions de login et de logout ici
  const login = (token, username) => {
    setToken(token);
    setUsername(username);
    setIsLogged(true);
  };

  const logout = () => {
    setToken("");
    setUsername("");
    setIsLogged(false);
  };

  const authData = {
    token,
    username,
    isLogged,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
