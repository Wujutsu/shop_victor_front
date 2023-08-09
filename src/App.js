import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import NavRoutes from "./NavRoutes";
import NavBar from "./components/navBar/NavBar";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

function App() {
  return (
    <div className="App  container-md">
      <NavBar />
      <NavRoutes />
      <ScrollToTop />
    </div>
  );
}

export default App;
