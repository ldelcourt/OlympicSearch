import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Vignette from "./vignette";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route> 
        <Route path="/test-vignette" element={<TestVignette />} />
      </Routes>
    </BrowserRouter>
  );
}

const TestVignette: React.FC = () => {
  return (
    <div>
      <h1>Test de la Vignette</h1>
      <Vignette
        imageSrc="https://cdn0.iconfinder.com/data/icons/flags-of-the-world-2/128/france-3-4096.png"
        title="France"
        type="Pays"
      />
    </div>
  );
};

export default App;

//<Route path="/vignette" element ={<Vignette/>}</Route></Route>
