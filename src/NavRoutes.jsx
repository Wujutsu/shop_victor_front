import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Account from "./pages/account/Account";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";

export const NavRoutes = () => {
  const { isLogged } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account" element={isLogged ? <Account /> : <Login />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={isLogged ? <Cart /> : <Shop />} />

      {/* Nouvelle route pour les détails du produit 
        <Route path="/product/:productId" element={<ProductDetails />} />*/}
    </Routes>
  );
};

export default NavRoutes;
