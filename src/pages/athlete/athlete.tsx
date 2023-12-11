import React, { useState } from "react";
import { useQuery } from "react-query";
import { useEffect } from "react";


import { useParams } from "react-router-dom";
import './athlete.css';

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


async function getPageTitle(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const match = html.match(/<title>(.*?)<\/title>/i);
        if (match && match[1]) {
            return match[1];
        } else {
            return "Title not found";
        }
    } catch (error) {
        console.error("Error fetching page:", error);
        return "Error fetching page";
    }
}


function Athlete() {
    const { name } = useParams<{ name?: string }>();
    const [data, setData] = useState<any>();
    const formattedName = formatNomPrenom(name || '');

    const fetchData = async () => {
        const base_endpoint = "https://query.wikidata.org/sparql";
        const query = `
        SELECT ?birthdate ?name ?nat ?gender ?birthplace ?birthplaceLabel ?image ?competitions ?competitionsLabel 
        ?medals ?medalsLabel ?medalImage ?ranking ?sport ?sportLabel 
        WHERE {
            ?person wdt:P31 wd:Q5;
                rdfs:label "${formattedName}"@fr.
            OPTIONAL { ?person wdt:P569 ?birthdate. }
            OPTIONAL { ?person wdt:P21 ?gender. }
            OPTIONAL { ?person wdt:P19 ?birthplace. }
            OPTIONAL { ?person wdt:P641 ?sport. }
            OPTIONAL { ?person p:P1344 ?participation. }
            OPTIONAL { ?participation ps:P1344 ?competitions. }
            OPTIONAL { ?participation pq:P166 ?medals. }
            OPTIONAL { ?participation pq:P1352 ?ranking. }
            SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
            OPTIONAL { ?person wdt:P18 ?image. }
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
            <h1 className="blue-header">Olymp'IF</h1>
            <div className="container">
                <h1 className="p">
                    Nom : {formattedName}
                    <br />
                    Date de naissance : {data?.results?.bindings[0]?.birthdate?.value && formatDate(data?.results?.bindings[0]?.birthdate?.value)}
                    <br />
                    Sexe : {data?.results?.bindings[0]?.gender?.value === "http://www.wikidata.org/entity/Q6581097" ? "Homme" : "Femme"}
                    <br />
                    Lieu de naissance : {data?.results?.bindings[0]?.birthplaceLabel?.value}
                    <br />
                    <br />
                    Disciplines : {data?.results?.bindings[0]?.sportLabel?.value}                    
                </h1>

                <h2 className="image">
                    <img src={data?.results?.bindings[0]?.image?.value} />
                </h2>

            </div>
            <h3 className="compet">
                Palmarès Olympique : {data?.results?.bindings.map((binding: any, i: number) => {
                    const competitionLabel = binding.competitionsLabel?.value;
                    const medalsLabel = binding.medalsLabel?.value;
                    const rankingLabel = binding.ranking?.value;
                    if (competitionLabel && competitionLabel.toLowerCase().includes("olymp")) {
                        return (
                            <p key={i}>
                                -
                                {rankingLabel === '1' && <img className="medaille" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Gold Medal" />}
                                {rankingLabel === '2' && <img className="medaille" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Silver Medal" />}
                                {competitionLabel}
                            </p>
                        );
                    }
                    return null;
                })}
            </h3>

        </div>
    );
}

export default Athlete;
