import React, { useState, useEffect } from 'react';
import Vignette from './vignette'; 
import './tableauVignette.css';

interface VignetteData {
  id: string;
  imageSrc: string;
  title: string;
  type: string; 
  description: string;
}

function TableauVignettes() {
  const [vignettesData, setVignettesData] = useState<Array<VignetteData>>([]);
  const [filter, setFilter] = useState<string | null>(null);

  const init = () => {
    const initialVignettesData = [
       
        { imageSrc: 'https://cdn0.iconfinder.com/data/icons/flags-of-the-world-2/128/france-3-4096.png', title: 'France', type: 'Pays', id :'1', description : 'Voir historique de la france aux JO' },
        { imageSrc: 'https://th.bing.com/th/id/R.944bf66553c359b07f8dc12efcc2b92c?rik=%2fR5iAzoYH%2fqlUQ&riu=http%3a%2f%2fwww.drapeaux-du-monde.fr%2fdrapeaux-du-monde%2f3000%2fdrapeau-allemagne.jpg&ehk=Qdxz%2fBG89eaEloOoCJb3g9RodQuLuQXGUrSJhrDlfBA%3d&risl=&pid=ImgRaw&r=0', title: 'Allemagne', type: 'Pays', id :'2', description : 'Voir historique de l\'Allemagne aux JO' },
        { imageSrc: 'https://th.bing.com/th/id/OIP.TA_zFbZvXDgomMeYmkNqVwHaE7?rs=1&pid=ImgDetMain', title: 'Italie', type: 'Pays', id :'3', description : 'Voir historique de l\'Italie aux JO' },
        { imageSrc: 'https://freepngimg.com/thumb/spain/5-2-spain-flag-picture.png', title: 'Espagne', type: 'Pays', id :'4', description : 'Voir historique de l\'Espagne aux JO' },
        { imageSrc: 'https://th.bing.com/th/id/R.a6d0443a66c6d2c474b2e49929fa9127?rik=TVf752Pv%2fcEHaA&riu=http%3a%2f%2fsport24.lefigaro.fr%2fvar%2fplain_site%2fstorage%2fimages%2fnatation%2factualites%2fflorent-manaudou-impressionne-a-indianapolis-976779%2f26369753-1-fre-FR%2fFlorent-Manaudou-impressionne-a-Indianapolis.jpg&ehk=StLg9DNUQBizi4XTkYCqsXuZwubVRH77ww3L6zcfVuk%3d&risl=&pid=ImgRaw&r=0' , title: 'Florent Manaudou', type: 'Athlète', id :'5', description : 'Voir le palmares de Florent Manaudou'},
        { imageSrc: 'https://th.bing.com/th/id/R.015a05314606efc84fde63e8aa8f5e51?rik=Xvin9UHC6RX6mQ&pid=ImgRaw&r=0' , title: 'Laura Manaudou', type: 'Athlète', id :'6', description : 'Voir le palmares de Laura Manaudou'},
    ];
    setVignettesData(initialVignettesData);
  };

  useEffect(() => {
    init();
  }, []); // Ajoutez ceci pour appeler init lorsque le composant est monté

  const addVignette = (newVignette: VignetteData) => {
    setVignettesData(oldVignettesData => [...oldVignettesData, newVignette]);
  };

  const removeVignette = (id: string) => {
    setVignettesData(oldVignettesData => oldVignettesData.filter(vignette => vignette.id !== id));
  };

  const resetVignettesData = () => {
    setVignettesData([]); // Vide vignettesData
    init(); // Réinitialise vignettesData avec les données initiales
  };

  const filteredVignettesData = filter
    ? vignettesData.filter(vignette => vignette.type === filter)
    : vignettesData;

  return (
    <div>
      <div className="filter-container">
        <div 
          className={`filter-option ${filter === null ? 'filter-option-selected' : ''}`}
          title="Afficher tous les types"
          onClick={() => setFilter(null)}
        >
          Toutes les catégories
        </div>
        <div 
          className={`filter-option ${filter === 'Pays' ? 'filter-option-selected' : ''}`}
          title="Afficher seulement les pays"
          onClick={() => setFilter('Pays')}
        >
          Pays
        </div>
        <div 
          className={`filter-option ${filter === 'Edition' ? 'filter-option-selected' : ''}`}
          title="Afficher seulement les éditions"
          onClick={() => setFilter('Edition')}
        >
          Edition
        </div>
        <div 
          className={`filter-option ${filter === 'Athlète' ? 'filter-option-selected' : ''}`}
          title="Afficher seulement les athlètes"
          onClick={() => setFilter('Athlète')}
        >
          Athlète
        </div>
      </div>

      <div className="tableau-vignettes">
        {filteredVignettesData.map((vignetteData) => (
          <Vignette key={vignetteData.id} {...vignetteData} />
        ))}
      </div>
    </div>
  );
}

export default TableauVignettes;
