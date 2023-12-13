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

  async function fetchWikidataAthlete(id) {
    const endpointUrl = 'https://query.wikidata.org/sparql';
    const sparqlQuery = `
        SELECT ?titre ?birthdate ?givenName ?familyName ?gender ?birthplace ?birthplaceLabel ?image ?competitions ?competitionsLabel ?birthCountry ?birthCountryLabel
      ?medals ?medalsLabel ?medalImage ?ranking ?sport ?sportLabel ?birthCountryImage ?description
      WHERE {
          BIND(wd:${id} AS ?person).
          OPTIONAL {?person rdfs:label ?titre. FILTER(LANG(?titre) = "fr")}
          OPTIONAL { ?person wdt:P569 ?birthdate. }
          OPTIONAL { ?person wdt:P735 ?givenName. }
          OPTIONAL { ?person wdt:P734 ?familyName. }
          OPTIONAL { ?person wdt:P21 ?gender. }
          OPTIONAL { ?person wdt:P19 ?birthplace. }
          OPTIONAL { ?person wdt:P641 ?sport. }
          OPTIONAL { ?person p:P1344 ?participation. }
          OPTIONAL { ?birthplace wdt:P17 ?birthCountry. }
          OPTIONAL { ?birthCountry wdt:P41 ?birthCountryImage. }
          OPTIONAL { ?participation ps:P1344 ?competitions. }
          OPTIONAL { ?participation pq:P166 ?medals. }
          OPTIONAL { ?participation pq:P1352 ?ranking. }
          OPTIONAL { ?person schema:description ?description. FILTER(LANG(?description) = "fr") }
          OPTIONAL { ?person wdt:P18 ?image. }
          SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
      }

    `;
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { 'Accept': 'application/sparql-results+json' };

    const response = await fetch(fullUrl, { headers });
    return await response.json();
  }

  async function createVignetteAthlete(id) {
    const data = await fetchWikidataAthlete(id);
    if (data.results.bindings.length > 0) {
        const item = data.results.bindings[0];
        const vignetteData = {
            id: id,
            imageSrc: item.image ? item.image.value : '',
            title: item.titre ? item.titre.value : '',
            type: 'Athlète',
            description: item.description ? item.description.value : ''
        };
        console.log(vignetteData);
        return vignetteData;
    } else {
        throw new Error('No data found for this id');
    }
}


  const init = async () => {
    const initialVignettesData = [
        { imageSrc: 'https://cdn0.iconfinder.com/data/icons/flags-of-the-world-2/128/france-3-4096.png', title: 'France', type: 'Pays', id :'1', description : 'Voir historique de la france aux JO' },
        { imageSrc: 'https://th.bing.com/th/id/R.944bf66553c359b07f8dc12efcc2b92c?rik=%2fR5iAzoYH%2fqlUQ&riu=http%3a%2f%2fwww.drapeaux-du-monde.fr%2fdrapeaux-du-monde%2f3000%2fdrapeau-allemagne.jpg&ehk=Qdxz%2fBG89eaEloOoCJb3g9RodQuLuQXGUrSJhrDlfBA%3d&risl=&pid=ImgRaw&r=0', title: 'Allemagne', type: 'Pays', id :'2', description : 'Voir historique de l\'Allemagne aux JO' },
        { imageSrc: 'https://th.bing.com/th/id/OIP.TA_zFbZvXDgomMeYmkNqVwHaE7?rs=1&pid=ImgDetMain', title: 'Italie', type: 'Pays', id :'3', description : 'Voir historique de l\'Italie aux JO' },
        { imageSrc: 'https://freepngimg.com/thumb/spain/5-2-spain-flag-picture.png', title: 'Espagne', type: 'Pays', id :'4', description : 'Voir historique de l\'Espagne aux JO' },
        { imageSrc: 'https://th.bing.com/th/id/R.a6d0443a66c6d2c474b2e49929fa9127?rik=TVf752Pv%2fcEHaA&riu=http%3a%2f%2fsport24.lefigaro.fr%2fvar%2fplain_site%2fstorage%2fimages%2fnatation%2factualites%2fflorent-manaudou-impressionne-a-indianapolis-976779%2f26369753-1-fre-FR%2fFlorent-Manaudou-impressionne-a-Indianapolis.jpg&ehk=StLg9DNUQBizi4XTkYCqsXuZwubVRH77ww3L6zcfVuk%3d&risl=&pid=ImgRaw&r=0' , title: 'Florent Manaudou', type: 'Athlète', id :'Q137575', description : 'Voir le palmares de Florent Manaudou'},
        { imageSrc: 'https://th.bing.com/th/id/R.015a05314606efc84fde63e8aa8f5e51?rik=Xvin9UHC6RX6mQ&pid=ImgRaw&r=0' , title: 'Laura Manaudou', type: 'Athlète', id :'Q45659', description : 'Voir le palmares de Laura Manaudou'},
        { imageSrc: 'https://th.bing.com/th?id=OIF.ptw9dCIwkJBa2qa%2buJjxVg&rs=1&pid=ImgDetMain' , title: 'Simone Biles', type: 'Athlète', id :'Q7520267', description : 'Voir le palmares de Simone Biles'},
        { imageSrc: 'https://th.bing.com/th/id/OIP.ekg2Z9822n1eCZeXCVGrIgHaE8?rs=1&pid=ImgDetMain' , title: 'Nikola Karabatic', type: 'Athlète', id :'Q157809', description : 'Voir le palmares de Nikola Karabatic'},
        { imageSrc: 'https://th.bing.com/th/id/R.1692f06dcbda11972009a6d402824e39?rik=odcIkiwW70wfPw&pid=ImgRaw&r=0' , title: 'Thierry Omeyer', type: 'Athlète', id :'Q134709', description : 'Voir le palmares de Thierry Omeyer'},
        { imageSrc: 'https://www.gardasee.de/sites/default/files/teaserimg/tennis_adobestock_285441870_0.jpeg' , title: 'Tennis', type: 'Sport', id :'Q847', description : 'Voir l historique du tennis au JO'},
        { imageSrc: 'https://th.bing.com/th/id/OIP.X287QnzDv7AT_1SLpnpb2QHaE8?rs=1&pid=ImgDetMain' , title: 'athlétisme', type: 'Sport', id :'Q542', description : 'Voir l historique de l athètisme au JO'},
        { imageSrc: 'https://th.bing.com/th/id/OIP.GBa4nRMzIMsdiAKFze3MoAHaF7?rs=1&pid=ImgDetMain' , title: 'basket en fauteuil', type: 'Sport', id :'Q1128216', description : 'Voir l historique du basket fauteuil au JO'},
        await createVignetteAthlete('Q3195752'),
        await createVignetteAthlete('Q1189'),

    ];
    setVignettesData(initialVignettesData);
  };

  useEffect(() => {
    init();
  }, []); // Ajoutez ceci pour appeler init lorsque le composant est monté

  const addVignette = (newVignette: VignetteData) => {
    if (newVignette.type === 'Human') {
      newVignette.type = 'Athlète';
    }
  
    // Vérifie si une vignette avec le même ID existe déjà
    const isDuplicate = vignettesData.some(vignette => vignette.id === newVignette.id);
  
    if (!isDuplicate) {
      setVignettesData(oldVignettesData => [...oldVignettesData, newVignette]);
      return true; // Ajoute la vignette uniquement si elle n'existe pas déjà
    } else {
      console.warn(`La vignette avec l'ID ${newVignette.id} existe déjà.`);
      return false; // Indique que la vignette n'a pas été ajoutée
    }
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
