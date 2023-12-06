import React, { useState } from "react";
import { useQuery } from "react-query";
import { useEffect } from "react";


import { useParams } from "react-router-dom";
import './athlete.css';

function Athlete() {
    const { name } = useParams<{ name?: string }>();
    const [data, setData] = useState<any>();

    const fetchData = async () => {
        const base_endpoint = "https://query.wikidata.org/sparql";
        const formattedName = formatNomPrenom(name||'');
        const query = `
        SELECT ?birthdate
        WHERE {
          ?person wdt:P31 wd:Q5;
                  rdfs:label "${formattedName}"@fr.
          ?person wdt:P569 ?birthdate.
        }
        `;
 
        try {
            const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.json();
                console.log({ result });
                setData(result);
            } else {
                console.error("Erreur lors de la requête SPARQL");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        }
    };

    useEffect(() => {
        fetchData();
      }, []);

    // Function to format the date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('fr-FR', options);
        return formattedDate;
    };

    const formatNomPrenom = (nomPrenom: string): string => {
        // Divisez la chaîne en utilisant "_" comme séparateur
        const parts = nomPrenom.split('_');
      
        // Vérifiez s'il y a au moins deux parties (nom et prénom)
        if (parts.length >= 2) {
          // Formatez le nom et le prénom avec la première lettre en majuscule
          const nom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          const prenom = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      
          // Retournez la chaîne formatée
          return `${nom} ${prenom}`;
        } else {
          // Si la chaîne ne contient pas au moins deux parties, retournez la chaîne inchangée
          return nomPrenom;
        }
      };

    return (
        <div>
            <h1>Recherche : {data?.results?.bindings[0]?.birthdate?.value && formatDate(data?.results?.bindings[0]?.birthdate?.value)}</h1>
            {/* Autres éléments à afficher */}
        </div>
    );
}

export default Athlete;
