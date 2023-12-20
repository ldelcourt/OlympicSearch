import { ChangeEvent, useState } from "react";
import "./Search.css";
import  { VignetteProps } from "./vignette";
import { FecthResult, SearchQueryResult, SearchType } from "../interfaces";
import TableauVignettes from "./tableauVignette";


function Search() {
  //Texte saisi par l'utilisateur
  const [texteSaisie, setTexteSaisie] = useState<string>();

  //Tableau pour stocker les resultats de la query
  const [queryResult, setQueryResult] = useState<VignetteProps[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

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
 
   SELECT DISTINCT ?id ?title ?imageSrc ?description
   WHERE {
     ?id wdt:P31 wd:Q159821;
                  rdfs:label ?title;
                   wdt:P17 ?country;
                 schema:description ?description.
     FILTER((CONTAINS(LCASE(?title), "${texteSaisie?.toLowerCase()}" )) || (CONTAINS(LCASE(?description), "${texteSaisie?.toLowerCase()}"))).

     FILTER(LANG(?title) = 'fr').
     FILTER(LANG(?description) = 'fr').

     OPTIONAL { ?id wdt:P17 ?pays;}
     OPTIONAL { ?id wdt:P18 ?image2. }
     OPTIONAL { ?id wdt:P154 ?image1. }

 
     BIND(COALESCE(?image1, ?image2) AS ?imageSrc)
   
     SERVICE wikibase:label {
       bd:serviceParam wikibase:language "[LANGUE_DE_VOTRE_CHOIX],fr".
     }
   }
   `;

  //Fonctionne bien
  const sportQuery = `
   SELECT DISTINCT ?title ?id ?imageSrc ?description
   WHERE {
     ?id wdt:P31 wd:Q31629;
            rdfs:label ?title;
            p:P279 ?subclass_sport;
            schema:description ?description.
     ?subclass_sport ps:P279 wd:Q212434.
     FILTER(CONTAINS(lcase(?title), "${texteSaisie?.toLowerCase()}") || CONTAINS(lcase(?description), "${texteSaisie?.toLowerCase()}")).       
      FILTER(LANG(?title) = "fr" && lang(?description) = 'fr').
     OPTIONAL { ?id wdt:P18 ?imageSrc. }   
   }
 `;
  //Fontionne bien
  const athleteQuery = `
  SELECT DISTINCT ?id ?title ?imageSrc ?description WHERE {
    ?id wdt:P31 wd:Q5;
        wdt:P106 ?profession;
        rdfs:label ?title;
        wdt:P1344 ?participation;
        wdt:P569 ?birthDate.
    ?profession wdt:P279 wd:Q2066131;
                wdt:P425 ?sport.
    ?sport wdt:P279 wd:Q212434.
    ?participation wdt:P31 wd:Q18536594.
    FILTER(YEAR(?birthDate) > 1960).
    FILTER(LANG(?title) = 'fr' && 
          CONTAINS(LCASE(?title), "${texteSaisie?.toLowerCase()}" )).
    OPTIONAL { ?id wdt:P18 ?imageSrc }
    OPTIONAL { ?id schema:description ?description. FILTER(LANG(?description) = 'fr'). }
  }
LIMIT 5
    `;

  //Fonctionne bien 
    const countryQuery = `
    SELECT distinct ?id ?title ?description ?imageSrc
    WHERE {
        ?temp wdt:P31 wd:Q26213387;
            wdt:P17 ?country;
            rdfs:label ?pageName;
            wdt:P179 ?id.
           
        
        FILTER(
          LANG(?pageName) = 'fr' && 
          CONTAINS(LCASE(?pageName), "${texteSaisie?.toLowerCase()}" )  
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
    setLoading(true);
    setQueryResult([]);
    await fetchData(editionQuery, 'Edition');
    await fetchData(sportQuery, 'Sport');
    await fetchData(countryQuery, 'Pays');
    await fetchData(athleteQuery, 'Athlète');
    setLoading(false);
  };

  const fetchData = async (query: string, typeQuery: SearchType) => {
    const base_endpoint = "https://query.wikidata.org/sparql";

    try {
      const response = await fetch(
        `${base_endpoint}?query=${encodeURIComponent(query)}&format=json`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const result: FecthResult<SearchQueryResult> = await response.json();
        const temp: VignetteProps[] = result!.results!.bindings.map((row) => ({
          description: row.description?.value,
          id: row.id.value!.substring(row.id.value!.lastIndexOf("/") + 1),
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
        <br />
        <div className="search-container">
          <input
            type="text"
            id="search"
            value={texteSaisie}
            onChange={handleChange}
            placeholder="Rechercher..."
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                handleClick();
              }
            }}
          />
          <button onClick={handleClick} type="submit" id="search-button">
            <img
              src="https://cdn-icons-png.flaticon.com/256/3917/3917132.png"
              alt="Rechercher"
            ></img>
          </button>
        </div>
      </div>
      {
        loading ? 
        <div className="loader"></div> :
        <TableauVignettes initialVignettes={queryResult} />
      }
    </>
  );
}
export default Search;
