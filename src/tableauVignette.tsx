import React, { useState, useEffect } from 'react';
import Vignette, { VignetteProps } from './vignette'; 
import './tableauVignette.css';

interface TableauVignettesProps {
  initialVignettes?: VignetteProps[] | null;
}
function TableauVignettes({ initialVignettes }: TableauVignettesProps) {
  const [vignettesData, setVignettesData] = useState<Array<VignetteProps>>([]);
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

  async function fetchOlympicGameData(id) {
    const endpointUrl = 'https://query.wikidata.org/sparql';
    const edition_query = `
    wd:${id} rdfs:label ?edition.
    FILTER(lang(?edition) = 'fr').
    `;
  const logo_query = `
    wd:${id} p:P154 ?logo.
    ?logo ps:P154 ?logoUrl.
    `;

  const location_query = `
    wd:${id} p:P276 ?l.
    ?l ps:P276 ?locationPage.
    ?locationPage rdfs:label ?location.
    FILTER(lang(?location) = 'fr').
    `;

  const counts_query = `
    wd:${id} p:P1132 ?n.
    ?n ps:P1132 ?count.
    BIND(xsd:integer(?count) AS ?countValue).
    `;

  const country_query = `
    wd:${id} p:P17 ?c.
    ?c ps:P17 ?countryPage.
    ?countryPage rdfs:label ?country.
    FILTER(lang(?country) = 'fr').
    `;

  const start_time_query = `
    wd:${id} p:P580 ?st.
    ?st ps:P580 ?start_time.
    `;

  const end_time_query = `
    wd:${id} p:P582 ?et.
    ?et ps:P582 ?end_time.
    `;

    const logo_image_query = `
    wd:${id} p:P18 ?logoImage.
    ?logoImage ps:P18 ?logoImageURL.
    `;

  const sparqlQuery = `
    SELECT ?edition ?location ?country ?logoUrl ?logoImageURL ?countValue ?start_time ?end_time
    WHERE {
      ${edition_query}
      OPTIONAL{
        ${location_query}
      }
      OPTIONAL{
        ${country_query}
      }
      OPTIONAL {
        ${counts_query}
      }
      OPTIONAL {
        ${logo_query}
      }
      OPTIONAL {
        ${start_time_query}
        ${end_time_query}
      }
      OPTIONAL {
        ${logo_image_query}
      }
    }`;

    const fullUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { 'Accept': 'application/sparql-results+json' };
  
    const response = await fetch(fullUrl, { headers });
    return await response.json();
  }

  async function fetchWikidataPays(id) {
    const endpointUrl = 'https://query.wikidata.org/sparql';
    const sparqlQuery = `
    SELECT DISTINCT ?country ?name ?image WHERE {
      ?pays_edition wdt:P179 wd:${id}.
      ?pays_edition wdt:P17 ?country.
      ?country wdt:P1813 ?name.
      ?country wdt:P41 ?image.
      FILTER(lang(?name) = 'fr')
    }
    `;
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { 'Accept': 'application/sparql-results+json' };

    const response = await fetch(fullUrl, { headers });
    return await response.json();
  }

  async function fetchWikidataSport(id) {
    const endpointUrl = 'https://query.wikidata.org/sparql';
    const sportQuery = `
        SELECT ?name ?icon ?description ?pays ?paysLabel
        WHERE {
            wd:${id} rdfs:label ?name;
                    schema:description ?description.
            OPTIONAL { wd:${id} wdt:P495 ?pays }
            OPTIONAL { wd:${id} wdt:P2910 ?icon }
            FILTER(LANG(?name) = 'fr' && LANG(?description) = 'fr').
            SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
        }
        `;
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent(sportQuery);
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
        return vignetteData;
    } else {
        throw new Error('No data found for this id');
    }
}

async function createVignetteOlympicGame(id) {
  const data = await fetchOlympicGameData(id);
  if (data.results.bindings.length > 0) {
      const item = data.results.bindings[0];
      const vignetteData = {
          id: id,
          imageSrc: item.logoUrl ? item.logoUrl.value : (item.logoImageUrl ? item.logoImageUrl.value : ''),
          title: item.edition ? item.edition.value : '',
          type: 'Edition',
          description: item.country ? item.country.value : ''
      };
      return vignetteData;
  } else {
      throw new Error('No data found for this id');
  }
}

async function createVignettePays(id) {
  const data = await fetchWikidataPays(id);
  if (data.results.bindings.length > 0) {
      const item = data.results.bindings[0];
      const vignetteData = {
          id: id,
          imageSrc: item.image ? item.image.value : '',
          title: item.name ? item.name.value : '',
          type: 'Pays',
          description: item.name ? item.name.value : ''
      };
      return vignetteData;
  } else {
      throw new Error('No data found for this id');
  }
}

async function createVignetteSport(id) {
  const data = await fetchWikidataSport(id);
  if (data.results.bindings.length > 0) {
      const item = data.results.bindings[0];
      const vignetteData = {
          id: id,
          imageSrc: item.icon ? item.icon.value : '',
          title: item.name ? item.name.value : '',
          type: 'Sport',
          description: item.description ? item.description.value : ''
      };
      return vignetteData;
  } else {
      throw new Error('No data found for this id');
  }
}


  const init = async () => {
    if (initialVignettes?.length == 0) {
      const initialVignettesData = [
        //{ imageSrc: 'https://th.bing.com/th/id/R.a6d0443a66c6d2c474b2e49929fa9127?rik=TVf752Pv%2fcEHaA&riu=http%3a%2f%2fsport24.lefigaro.fr%2fvar%2fplain_site%2fstorage%2fimages%2fnatation%2factualites%2fflorent-manaudou-impressionne-a-indianapolis-976779%2f26369753-1-fre-FR%2fFlorent-Manaudou-impressionne-a-Indianapolis.jpg&ehk=StLg9DNUQBizi4XTkYCqsXuZwubVRH77ww3L6zcfVuk%3d&risl=&pid=ImgRaw&r=0' , title: 'Florent Manaudou', type: 'Athlète', id :'Q137575', description : 'Voir le palmares de Florent Manaudou'},
        //{ imageSrc: 'https://th.bing.com/th/id/R.015a05314606efc84fde63e8aa8f5e51?rik=Xvin9UHC6RX6mQ&pid=ImgRaw&r=0' , title: 'Laura Manaudou', type: 'Athlète', id :'Q45659', description : 'Voir le palmares de Laura Manaudou'},
        //{ imageSrc: 'https://th.bing.com/th?id=OIF.ptw9dCIwkJBa2qa%2buJjxVg&rs=1&pid=ImgDetMain' , title: 'Simone Biles', type: 'Athlète', id :'Q7520267', description : 'Voir le palmares de Simone Biles'},
        //{ imageSrc: 'https://th.bing.com/th/id/OIP.ekg2Z9822n1eCZeXCVGrIgHaE8?rs=1&pid=ImgDetMain' , title: 'Nikola Karabatic', type: 'Athlète', id :'Q157809', description : 'Voir le palmares de Nikola Karabatic'},
        //{ imageSrc: 'https://th.bing.com/th/id/R.1692f06dcbda11972009a6d402824e39?rik=odcIkiwW70wfPw&pid=ImgRaw&r=0' , title: 'Thierry Omeyer', type: 'Athlète', id :'Q134709', description : 'Voir le palmares de Thierry Omeyer'},
        //{ imageSrc: 'https://www.gardasee.de/sites/default/files/teaserimg/tennis_adobestock_285441870_0.jpeg' , title: 'Tennis', type: 'Sport', id :'Q847', description : 'Voir l historique du tennis au JO'},
        //{ imageSrc: 'https://th.bing.com/th/id/OIP.X287QnzDv7AT_1SLpnpb2QHaE8?rs=1&pid=ImgDetMain' , title: 'athlétisme', type: 'Sport', id :'Q542', description : 'Voir l historique de l athètisme au JO'},
        //{ imageSrc: 'https://th.bing.com/th/id/OIP.GBa4nRMzIMsdiAKFze3MoAHaF7?rs=1&pid=ImgDetMain' , title: 'basket en fauteuil', type: 'Sport', id :'Q1128216', description : 'Voir l historique du basket fauteuil au JO'},
        await createVignetteAthlete('Q3195752'), // Michael Phelps
        await createVignetteAthlete('Q1189'), 
        await createVignetteAthlete('Q45659'), 
        await createVignetteAthlete('Q137575'), // Florent Manaudou
        await createVignetteAthlete('Q7520267'), // Simone Biles
        await createVignetteAthlete('Q134709'), // Thierry Omeyer
        await createVignetteAthlete('Q157809'), // Nikola Karabatic
        await createVignettePays('Q742512'), // France
        await createVignettePays('Q749175'), 
        await createVignetteAthlete('Q705966'),
        await createVignetteAthlete('Q1652'), 
        await createVignetteSport('Q847'), 
        await createVignetteSport('Q542'),  
        await createVignetteSport('Q1128216'), 
        await createVignetteOlympicGame('Q995653'), 
        await createVignetteOlympicGame('Q181278'), 
        await createVignetteOlympicGame('Q8613'), 
        await createVignetteOlympicGame('Q8577'), 
        await createVignetteOlympicGame('Q8567'), 
        await createVignetteAthlete('Q39562'), 
        await createVignetteAthlete('Q22102'), 
        await createVignetteAthlete('Q131237'),
        await createVignetteAthlete('Q216256'),
        await createVignetteAthlete('Q189408'),
        await createVignetteAthlete('Q177969'),
        await createVignetteSport('Q43450'),
        //await createVignettePays('Q742661'),

    ];
      setVignettesData(initialVignettesData);
    } else if (initialVignettes) {
      setVignettesData(initialVignettes);
    }
  };


  useEffect(() => {
    init();
  }, [initialVignettes]);

  const addVignette = (newVignette: VignetteProps) => {
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
        <div 
          className={`filter-option ${filter === 'Sport' ? 'filter-option-selected' : ''}`}
          title="Afficher seulement les sports"
          onClick={() => setFilter('Sport')}
        >
          Sport
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
