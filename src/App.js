import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import NavBar from "./components/navBar/NavBar";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import Routing from "./Routing";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="App">
      <div className="container-md contenu">
        <NavBar />

        {/* Affichage des pages en fonction de l'url */}
        <Routing />
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
