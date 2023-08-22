import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Account from "./pages/account/Account";
import Shop from "./pages/shop/Shop";
import CartPageOne from "./pages/cart/cartPageOne/CartPageOne";
import Admin from "./pages/admin/Admin";
import NotFound from "./pages/notFound/NotFound";
import CartPageTwo from "./pages/cart/cartPageTwo/CartPageTwo";
import SuccessPayment from "./pages/cart/successPayment/SuccessPayment";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import ProductDetails from "./pages/productDetails/ProductDetails";

const Routing = () => {
  const { isLogged, role, nbCartItem, stripeClientSecret } =
    useContext(UserContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={isLogged ? <Account /> : <Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/product/:productId" element={<ProductDetails />} />
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
          path="/success/payment"
          element={
            isLogged ? (
              stripeClientSecret !== "" ? (
                <SuccessPayment />
              ) : (
                <Shop />
              )
            ) : (
              <NotFound />
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
      </Routes>
    </>
  );
};

export default Routing;
