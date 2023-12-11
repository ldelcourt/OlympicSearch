import React, { useState } from 'react';
import Vignette from './vignette'; // Assurez-vous que le chemin du fichier est correct
import './tableauVignette.css';

interface VignetteData {
  imageSrc: string;
  title: string;
  type: string; // Assumons que c'est soit 'Pays', 'Edition', ou 'Athlète'
}

interface TableauVignettesProps {
  vignettesData: Array<VignetteData>;
}

function TableauVignettes({ vignettesData }: TableauVignettesProps) {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredVignettesData = filter
    ? vignettesData.filter(vignette => vignette.type === filter)
    : vignettesData;

  return (
    <div>
      <div>
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
        {filteredVignettesData.map((vignetteData, index) => (
          <Vignette key={index} {...vignetteData} />
        ))}
      </div>
    </div>
  );
}

export default TableauVignettes;
