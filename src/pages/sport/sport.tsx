import React, { useState } from "react";
import { useEffect } from "react";


import { useParams } from "react-router-dom";
import './sport.css';

const formatSport = (nomsport: string): string => {
    // Divisez la chaîne en utilisant "_" comme séparateur
    const parts = nomsport.split('_');

    // Vérifiez s'il y a au moins deux parties (nom et prénom)
    if (parts.length >= 2) {
        // Formatez le nom et le prénom avec la première lettre en majuscule
        const part1 = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const part2 = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);

        // Retournez la chaîne formatée
        return `${part1} ${part2}`;
    } else {
        // Si la chaîne ne contient pas au moins deux parties, retournez la chaîne inchangée
        return nomsport;
    }
};


function Sport() {

    useEffect(() => {
        document.title = "Olymp'IF - Sport";
      }, []);

    const { name } = useParams<{ name?: string }>();
    const [data, setData] = useState<any>();
    const formattedName = formatSport(name || '');

    const fetchData = async () => {
        const base_endpoint = "https://query.wikidata.org/sparql";
        const query = `
        SELECT ?name ?icon ?description ?pays ?paysLabel
            WHERE {
                ?sport wdt:P31 wd:Q31629;
                    rdfs:label "${formattedName}"@fr.
                OPTIONAL { ?sport wdt:P495 ?pays. }
                OPTIONAL { ?sport schema:description ?description. FILTER(LANG(?description) = "fr") }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
                OPTIONAL { ?sport wdt:P2910 ?icon. }
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


    return (
        <div>
            <div className="container">
                <h1 className="p">
                    <strong>Discipline :</strong> {formattedName}
                    <br />
                    <strong>Pays d'origine :</strong> {data?.results?.bindings[0]?.paysLabel?.value}     
                    <br />
                    <strong>Description :</strong> {data?.results?.bindings[0]?.description?.value}        
                </h1>

                <h2 className="image">
                    <img src={data?.results?.bindings[0]?.icon?.value} />
                </h2>

            </div>
            <br />
            <div style={{ textAlign: 'center' }}>
                {data?.results?.bindings.length === 0 ? <p>Aucune donnée trouvée</p> : <p>Sources : Wikidata </p>}
            </div>
        </div>
    );
}

export default Sport;
