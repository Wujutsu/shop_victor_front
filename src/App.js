import "./App.scss";
import { NavRoutes } from "./NavRoutes";
import { NavBar } from "./components/navBard/NavBar";
import { ScrollToTop } from "./components/scrollToTop/ScrollToTop";

function App() {
  return (
    <div className="App">
      <NavBar />
      <NavRoutes />
      <ScrollToTop />
    </div>
  );
}

export default App;
