import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Footer from "./components/Footer";
import Admin from "./components/Admin";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Intro />
          <hr />
          <Admin />
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
