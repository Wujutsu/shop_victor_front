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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const [nbCartItem, setNbCartItem] = useState(0);
  const [totalCommandItem, setTotalCommandItem] = useState(0);
  const [addressOrder, setAddressOrder] = useState({});
  const [stripeClientSecret, setStripeClientSecret] = useState("");

  //Récupére les données sauvegardées en local lors du chargement initial du composant
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedFirstName = localStorage.getItem("firstName");
    const savedLastName = localStorage.getItem("lastName");
    const savedEmail = localStorage.getItem("email");
    const savedPhoneNumber = localStorage.getItem("phoneNumber");
    const savedRole = localStorage.getItem("role");
    const savedisLogged = localStorage.getItem("isLogged");
    const savedCartItem = JSON.parse(localStorage.getItem("cartItem"));
    const savedNbCartItem = localStorage.getItem("nbCartItem");
    const savedTotalCommandItem = localStorage.getItem("totalCommandItem");
    const savedAddressOrder = JSON.parse(localStorage.getItem("addressOrder"));
    const savedStripeClientSecret = localStorage.getItem("stripeClientSecret");

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
      setPhoneNumber(savedPhoneNumber);
      setRole(savedRole);
      setIsLogged(savedisLogged === "true");
    }

    if (savedCartItem) {
      if (savedCartItem.length > 0) {
        setCartItem(savedCartItem);
        setNbCartItem(savedNbCartItem);
      }
    }

    if (savedTotalCommandItem) {
      setTotalCommandItem(savedTotalCommandItem);
    }

    if (savedAddressOrder) {
      setAddressOrder(savedAddressOrder);
    }

    if (savedStripeClientSecret) {
      setStripeClientSecret(savedStripeClientSecret);
    }
  }, []);

  //Permet de sauvegarder les données de l'utilisateur en local chaque fois qu'elles sont mises à jour
  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("email", email);
    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("role", role);
    localStorage.setItem("isLogged", isLogged);
    localStorage.setItem("cartItem", JSON.stringify(cartItem));
    localStorage.setItem("nbCartItem", nbCartItem);
    localStorage.setItem("totalCommandItem", totalCommandItem);
    localStorage.setItem("addressOrder", JSON.stringify(addressOrder));
    localStorage.setItem("stripeClientSecret", stripeClientSecret);
  }, [
    token,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    isLogged,
    cartItem,
    nbCartItem,
    totalCommandItem,
    addressOrder,
    stripeClientSecret,
  ]);

  //Met à jour info utilisateur
  const handleUpdateInfos = (firstName, lastName, email, phoneNumber) => {
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
    setPhoneNumber(phoneNumber);
  };

  //Mémorise info utilisateur à la connexion
  const handleSaveLogin = (
    token,
    firstName,
    lastName,
    email,
    phoneNumber,
    role
  ) => {
    setToken(token);
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
    setPhoneNumber(phoneNumber == null ? "" : phoneNumber);
    setRole(role);
    setIsLogged(true);
  };

  //Supprimer info utilisateur à la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("role");
    setToken("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setRole("");

    setIsLogged(false);
    navigate("/login");
  };

  //Ajout des items dans le panier
  const handleAddCartItem = (id, categorie, name, price) => {
    let newItem = {
      id: id,
      categorie: categorie,
      name: name,
      quantity: 1,
      price: price,
    };
    let updatedCartItems = [];

    if (cartItem !== null) {
      // Vérifiez si un élément avec le même id existe déjà dans cartItem
      const itemIndex = cartItem.findIndex((item) => item.id === newItem.id);

      if (itemIndex !== -1) {
        // L'élément existe, incrémente la quantité
        updatedCartItems = [...cartItem];
        updatedCartItems[itemIndex].quantity += 1;
      } else {
        // L'élément n'existe pas encore, on ajoute
        updatedCartItems = [...cartItem, newItem];
      }
    } else {
      updatedCartItems.push(newItem);
    }

    let updateNbCartItem = parseInt(nbCartItem) + 1;

    setNbCartItem(updateNbCartItem);
    setCartItem(updatedCartItems);
  };

  //Supprime des items ou quantité du panier
  const handleDeleteCartItem = (id) => {
    const itemIndex = cartItem.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      let updatedCartItems = [...cartItem];

      if (updatedCartItems[itemIndex].quantity > 1) {
        updatedCartItems[itemIndex].quantity -= 1;
      } else {
        updatedCartItems.splice(itemIndex, 1);
      }

      setCartItem(updatedCartItems);
      setNbCartItem(nbCartItem - 1);
    }
  };

  //On reset les valeurs lorsqu'une commande à été effectutée
  const handleEraseAfterOrder = () => {
    setCartItem([]);
    setNbCartItem(0);
    setTotalCommandItem(0);
    setAddressOrder({});
  };

  const dataList = {
    token,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    isLogged,
    handleUpdateInfos,
    handleSaveLogin,
    handleLogout,
    cartItem,
    setCartItem,
    nbCartItem,
    setNbCartItem,
    totalCommandItem,
    setTotalCommandItem,
    addressOrder,
    setAddressOrder,
    handleAddCartItem,
    handleDeleteCartItem,
    handleEraseAfterOrder,
    stripeClientSecret,
    setStripeClientSecret,
  };

  return (
    <UserContext.Provider value={dataList}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
