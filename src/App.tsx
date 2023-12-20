
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Vignette from "./vignette";
import TableauVignettes from './tableauVignette'; // Assurez-vous que le chemin du fichier est correct
import Athlete from "./pages/athlete/athlete";
import Sport from "./pages/sport/sport";
import Pays from "./pages/pays/pays";

import Edition from "./pages/edition/edition";
import Header from "./Component/Header";

function App() {

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/test-vignette" element={<TestVignette />} />
        <Route path="/tableau-vignettes" element={<TableauVignettes/>} />
        <Route path="/edition/:edition" element={<Edition/>}></Route>
        <Route path="/athlete/:idParam" Component={Athlete} />
        <Route path="/sport/:idSport" Component={Sport} />
        <Route path="/pays/:idPays" Component={Pays} />
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

