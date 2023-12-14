import { ChangeEvent, useState } from "react";
import "./Search.css";
import { useEffect } from "react";
import { json, useParams } from "react-router-dom";

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
  var result =JSON.stringify({ });
  const [texteSaisie, setTexteSaisie] = useState<any>();
  const [jsonText, setJsonTexte] =useState<any>();
  const { name } = useParams<{ name?: string }>();
  // const formattedInput = formatInput(name || '');

  

  const handleClick = (): void => {
  fetchData();
};


  
  const fetchData = async () => {
    const base_endpoint = "https://query.wikidata.org/sparql";
    

    //test requete édition
    const query = `
    SELECT ?name_edition ?nomLabel ?image ?paysLabel ?nature_de_l_élémentLabel
    WHERE {
      ?name_edition wdt:P31 wd:Q159821;
                   rdfs:label ?nomLabel.
    
      FILTER(LANG(?nomLabel) = "fr" && CONTAINS(?nomLabel, "${texteSaisie}" )).
    
      OPTIONAL { ?name_edition wdt:P17 ?pays;}
      OPTIONAL { ?name_edition wdt:P18 ?image. }
      OPTIONAL { ?name_edition wdt:P31 ?nature_de_l_élément.}
    
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "[LANGUE_DE_VOTRE_CHOIX],fr".
      }
    }
    

    `;
   



    try {
        const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
            method: "GET",
        });

        if (response.ok) {
            result = await response.json();
            setJsonTexte(JSON.stringify(result));
            
            console.log({ result });
            setTexteSaisie(result);
        } else {
            console.error("Erreur lors de la requête SPARQL");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }

console.log(result?.results?.bindings[0]?.nameLabel.value);

//si on trouve rien, on essaie une requete sur le sport
    if(result?.results?.bindings[0]?.nameLabel.value == undefined){
      const query = `
      SELECT ?name ?sport ?sportLabel ?image ?description
WHERE {
  ?sport wdt:P31 wd:Q31629;   # Type de sport : tennis
  rdfs:label ?sportLabel.
  FILTER(LANG(?sportLabel) = "fr" && CONTAINS(?sportLabel, "${texteSaisie}" ))

  OPTIONAL { ?sport schema:description ?description. FILTER(LANG(?description) = "fr") }
  ?sport rdfs:label ?name. FILTER(LANG(?name) = "fr")
  OPTIONAL { ?sport wdt:P18 ?image. }
}

    `;
    try {
      const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
          method: "GET",
      });

      if (response.ok) {
          result = await response.json();
          setJsonTexte(JSON.stringify(result));
          
          console.log({ result });
          setTexteSaisie(result);
      } else {
          console.error("Erreur lors de la requête SPARQL");
      }
  } catch (error) {
      console.error("Erreur réseau :", error);
  }


    }
    //personne athlète
    /*if(result?.results?.bindings[0]?.nameLabel.value == undefined){
      const query = `
      SELECT ?person ?personLabel ?image ?nature_de_l_élément ?nature_de_l_élémentLabel WHERE {
        ?person wdt:P31 wd:Q5;
        rdfs:label ?personLabel.
        FILTER(LANG(?personLabel) = "fr" && CONTAINS(?personLabel, "${texteSaisie}" ))
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
        OPTIONAL { ?person wdt:P18 ?image. }
        OPTIONAL { ?person wdt:P31 ?nature_de_l_élément. }
      }
    `;
    try {
      const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
          method: "GET",
      });

      if (response.ok) {
          result = await response.json();
          setJsonTexte(JSON.stringify(result));
          
          console.log({ result });
          setTexteSaisie(result);
      } else {
          console.error("Erreur lors de la requête SPARQL");
      }
  } catch (error) {
      console.error("Erreur réseau :", error);
  }


    }


    console.log(result?.results?.bindings[0]?.paysLabel.value);
*/

    //pays
    if(result?.results?.bindings[0]?.nameLabel.value == undefined){
      const query = `
      SELECT distinct ?pays ?paysLabel ?capitaleLabel
WHERE {
  ?pays wdt:P31 wd:Q6256;  # Q6256 représente l'élément pour les pays, ajustez-le si nécessaire
        wdt:P1344 ?jeuxOlympiques;  # P1344 indique la participation aux Jeux Olympiques
        rdfs:label ?paysLabel.
        FILTER(LANG(?paysLabel) = "fr" && CONTAINS(?paysLabel, "${texteSaisie}" ))

  OPTIONAL { ?pays wdt:P36 ?capitale. }  # P36 indique la capitale
  OPTIONAL { ?pays wdt:P1082 ?population. }  # P1082 indique la population
  OPTIONAL { ?pays wdt:P2046 ?superficie. }  # P2046 indique la superficie

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[LANGUE_DE_VOTRE_CHOIX],fr".
  }
}      
    `;
    try {
      const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
          method: "GET",
      });

      if (response.ok) {
          result = await response.json();
          setJsonTexte(JSON.stringify(result));
          
          console.log({ result });
          setTexteSaisie(result);
      } else {
          console.error("Erreur lors de la requête SPARQL");
      }
  } catch (error) {
      console.error("Erreur réseau :", error);
  }


    }


    console.log(result?.results?.bindings[0]?.paysLabel.value);
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
        />
        <button onClick={handleClick} type="submit" id="search-button">
          <img
            src="https://cdn-icons-png.flaticon.com/256/3917/3917132.png"
            alt="Rechercher"
          ></img>
        </button>
      </div>
      <div className="requetetext">
        <p className= "requete"> {jsonText} </p>
      </div>


    </div>
      
    </>
  );


}
export default Search;
