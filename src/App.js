import "./App.scss";
import { NavRoutes } from "./NavRoutes";
import { Header } from "./components/header/Header";
import { ScrollToTop } from "./components/scrollToTop/ScrollToTop";

function App() {
  return (
    <div className="App">
      <Header />
      <NavRoutes />
      <ScrollToTop />
    </div>
  );
}

export default App;
