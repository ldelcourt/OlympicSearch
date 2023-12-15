import { ChangeEvent, useState } from "react";
import "./Search.css";
import Vignette, { VignetteProps } from "../vignette";
import { useEffect } from "react";
import { json, useParams } from "react-router-dom";
import { FecthResult, SearchQueryResult, SearchType } from "../interfaces";
import TableauVignettes from "../tableauVignette";



const formatInput = (input: string): string => {
  // Divisez la chaîne en utilisant "_" comme séparateur
  const parts = input.split('_');

  // Vérifiez s'il y a au moins deux parties (nom et prénom)
  if (parts.length >= 2) {
      // Formatez le nom et le prénom avec la première lettre en majuscule
      const part1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      const part2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

      // Retournez la chaîne formatée
      return `${part1} ${part2}`;
  } else {
      // Si la chaîne ne contient pas au moins deux parties, retournez la chaîne inchangée
      return input;
  }
};

function Search() {
  //var result =JSON.stringify({ });
  const [texteSaisie, setTexteSaisie] = useState<string>();

  //Tableau pour stocker les resultats de la query
  const [queryResult, setQueryResult] =useState<VignetteProps[]>([]);
  const { name } = useParams<{ name?: string }>();
  // const formattedInput = formatInput(name || '');

   /** Requete Wikimedia
     * Les Requetes doivent rendre des attributs aux noms suivant
     * @id Id vers la page
     * @imageSrc Url vers l'image
     * @title Titre de la vignette
     * @type Type de la vignette passé en paramètre de fetchData
     * @description Description de la vignette
     * 
     */
   const editionQuery = `
   SELECT DISTINCT ?id ?title ?image ?description
   WHERE {
     ?id wdt:P31 wd:Q159821;
                  rdfs:label ?title;
                   wdt:P17 ?country;
                 schema:description ?description.
     
     
   
     FILTER((CONTAINS(?title, "${texteSaisie}" )) || (CONTAINS(?description, "${texteSaisie}"))).

     FILTER(LANG(?title) = 'fr').
     FILTER(LANG(?description) = 'fr').

     OPTIONAL { ?id wdt:P17 ?pays;}
     OPTIONAL { ?id wdt:P18 ?image1. }
     OPTIONAL { ?id wdt:P154 ?image2. }

 
     BIND(COALESCE(?image1, ?image2) AS ?image)
   
     SERVICE wikibase:label {
       bd:serviceParam wikibase:language "[LANGUE_DE_VOTRE_CHOIX],fr".
     }
   }
   `;

   //Fonctionne bien
   const sportQuery = `
   SELECT ?title ?id ?imageSrc ?description
   WHERE {
     ?id wdt:P31 wd:Q31629;   # Type de sport : tennis
            rdfs:label ?title;
            p:P279 ?subclass_sport;
            schema:description ?description.
     ?subclass_sport ps:P279 wd:Q212434.
     FILTER(CONTAINS(?title, "${texteSaisie}") || CONTAINS(?description, "${texteSaisie}")).       
      FILTER(LANG(?title) = "fr" && lang(?description) = 'fr').
     OPTIONAL { ?id wdt:P18 ?imageSrc. }   
   }
 `;
  //Ne fonctionne pas
  const athleteQuery = `
      SELECT ?person ?personLabel ?image ?nature_de_l_élément ?nature_de_l_élémentLabel WHERE {
        ?person wdt:P31 wd:Q5;
          rdfs:label "${texteSaisie}"@fr.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
        OPTIONAL { ?person wdt:P18 ?image. }
        OPTIONAL { ?person wdt:P31 ?nature_de_l_élément. }
      }
    `;

    const countryQuery = `
    SELECT distinct ?id ?title ?description ?imageSrc
    WHERE {
        ?temp wdt:P31 wd:Q26213387;
            wdt:P17 ?country;
            rdfs:label ?pageName;
            wdt:P179 ?id.
           
        
        FILTER(
          LANG(?pageName) = 'fr' && 
          CONTAINS(?pageName, "${texteSaisie}" )  
        ).
    
    OPTIONAL { ?country schema:description ?description }
    OPTIONAL { ?country wdt:P41 ?imageSrc }
    OPTIONAL { ?country rdfs:label ?title }
    FILTER(lang(?description) = 'fr' && LANG(?title) = "fr")

    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "[LANGUE_DE_VOTRE_CHOIX],fr".
      }
    } 
  `;


  const handleClick = async () => {
    setQueryResult([]);
    await fetchData(editionQuery, 'Edition');
    await fetchData(sportQuery, 'Sport');
    await fetchData(countryQuery, 'Pays');
  };


  
  const fetchData = async (query: string, typeQuery: SearchType) => {
    const base_endpoint = "https://query.wikidata.org/sparql";
    
    try {
        const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
            method: "GET",
        });

        if (response.ok) {
            const result:FecthResult = await response.json();
            const temp: VignetteProps[] = result.results.bindings.map((row) => ({
              description: row.description.value,
              id: row.id.value!.substring(row.id.value!.lastIndexOf('/') + 1), 
              imageSrc: row.imageSrc?.value,
              title: row.title.value,
              type: typeQuery,
            }));
            setQueryResult((prevQueryResult) => {
              return [...prevQueryResult, ...temp];
            });          
            console.log({ result });
        } else {
            console.error("Erreur lors de la requête SPARQL");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
};



const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
  setTexteSaisie(event.target.value);
  
  
  
};



  return (
    <>
    <div className="global">
      <div className="search-container">
        <input
          type="text"
          id="search"
          value={texteSaisie}
          onChange={handleChange}
          placeholder="Rechercher..."
        />
        <button onClick={handleClick} type="submit" id="search-button">
          <img
            src="https://cdn-icons-png.flaticon.com/256/3917/3917132.png"
            alt="Rechercher"
          ></img>
        </button>
      </div>

    </div>
      <TableauVignettes initialVignettes={queryResult} />
    </>
  );


}
export default Search;
