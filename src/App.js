import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";

import NavBar from "./components/navBar/NavBar";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Account from "./pages/account/Account";
import Shop from "./pages/shop/Shop";
import CartPageOne from "./pages/cart/cartPageOne/CartPageOne";
import Admin from "./pages/admin/Admin";
import NotFound from "./pages/notFound/NotFound";
import CartPageTwo from "./pages/cart/cartPageTwo/CartPageTwo";

function App() {
  const { isLogged, role, nbCartItem } = useContext(UserContext);

  return (
    <div className="App container-md">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={isLogged ? <Account /> : <Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={isLogged ? <CartPageOne /> : <Shop />} />
        <Route
          path="/cart/paiement"
          element={
            isLogged ? (
              nbCartItem > 0 ? (
                <CartPageTwo />
              ) : (
                <CartPageOne />
              )
            ) : (
              <Shop />
            )
          }
        />
        <Route
          path="/admin"
          element={isLogged && role === "ROLE_ADMIN" ? <Admin /> : <NotFound />}
        />
        <Route
          path="/admin/order"
          element={isLogged && role === "ROLE_ADMIN" ? <Admin /> : <NotFound />}
        />

        <Route path="*" element={<NotFound />} />

        {/* Nouvelle route pour les détails du produit 
        <Route path="/product/:productId" element={<ProductDetails />} />*/}
      </Routes>
      <ScrollToTop />
    </div>
  );
}

export default App;
