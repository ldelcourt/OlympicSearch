import { BrowserRouter, Route, Routes} from "react-router-dom";
import { useState } from 'react';
import Home from "./pages/home";
import Vignette from "./vignette";
import TableauVignettes from './tableauVignette'; // Assurez-vous que le chemin du fichier est correct
import Athlete from "./pages/athlete/athlete";

import Edition from "./pages/edition/edition";
import Header from "./Component/Header";

function App() {
  const [vignettesData, setVignettesData] = useState([
    // Les données pour chaque vignette
    { imageSrc: 'https://cdn0.iconfinder.com/data/icons/flags-of-the-world-2/128/france-3-4096.png', title: 'France', type: 'Pays', id :'1', description : 'Voir historique de la france aux JO' },
    { imageSrc: 'https://th.bing.com/th/id/R.944bf66553c359b07f8dc12efcc2b92c?rik=%2fR5iAzoYH%2fqlUQ&riu=http%3a%2f%2fwww.drapeaux-du-monde.fr%2fdrapeaux-du-monde%2f3000%2fdrapeau-allemagne.jpg&ehk=Qdxz%2fBG89eaEloOoCJb3g9RodQuLuQXGUrSJhrDlfBA%3d&risl=&pid=ImgRaw&r=0', title: 'Allemagne', type: 'Pays', id :'2', description : 'Voir historique de l\'Allemagne aux JO' },
    { imageSrc: 'https://th.bing.com/th/id/OIP.TA_zFbZvXDgomMeYmkNqVwHaE7?rs=1&pid=ImgDetMain', title: 'Italie', type: 'Pays', id :'3', description : 'Voir historique de l\'Italie aux JO' },
    { imageSrc: 'https://freepngimg.com/thumb/spain/5-2-spain-flag-picture.png', title: 'Espagne', type: 'Pays', id :'4', description : 'Voir historique de l\'Espagne aux JO' },
    { imageSrc: 'https://th.bing.com/th/id/R.a6d0443a66c6d2c474b2e49929fa9127?rik=TVf752Pv%2fcEHaA&riu=http%3a%2f%2fsport24.lefigaro.fr%2fvar%2fplain_site%2fstorage%2fimages%2fnatation%2factualites%2fflorent-manaudou-impressionne-a-indianapolis-976779%2f26369753-1-fre-FR%2fFlorent-Manaudou-impressionne-a-Indianapolis.jpg&ehk=StLg9DNUQBizi4XTkYCqsXuZwubVRH77ww3L6zcfVuk%3d&risl=&pid=ImgRaw&r=0' , title: 'Florent Manaudou', type: 'Athlète', id :'5', description : 'Voir le palmares de Florent Manaudou'},
    { imageSrc: 'https://th.bing.com/th/id/R.015a05314606efc84fde63e8aa8f5e51?rik=Xvin9UHC6RX6mQ&pid=ImgRaw&r=0' , title: 'Laura Manaudou', type: 'Athlète', id :'6', description : 'Voir le palmares de Laura Manaudou'},
    // ... Ajoutez les données pour les 8 vignettes
  ]);

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/test-vignette" element={<TestVignette />} />
        <Route path="/tableau-vignettes" element={<TableauVignettes vignettesData={vignettesData} />} />
        <Route path="/edition/:edition" element={<Edition/>}></Route>
        <Route path="/athlete/:name" Component={Athlete} />
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
