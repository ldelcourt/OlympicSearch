import React, { useState } from "react";
import { useEffect } from "react";


import { useParams } from "react-router-dom";
import './athlete.css';
/*
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
};*/

const CountGoldMedals = (data: any) => {
    let count = 0;
    data?.results?.bindings.map((binding: any, i: number) => {
        const competitionLabel = binding.competitionsLabel?.value;
        const medalsLabel = binding.medalsLabel?.value;
        const rankingLabel = binding.ranking?.value;
        if (competitionLabel && competitionLabel.toLowerCase().includes("olymp") && rankingLabel === '1') {
            count++;
        }
    });
    return count;
}

const CountSilverMedals = (data: any) => {
    let count = 0;
    data?.results?.bindings.map((binding: any, i: number) => {
        const competitionLabel = binding.competitionsLabel?.value;
        const medalsLabel = binding.medalsLabel?.value;
        const rankingLabel = binding.ranking?.value;
        if (competitionLabel && competitionLabel.toLowerCase().includes("olymp") && rankingLabel === '2') {
            count++;
        }
    });
    return count;
}

const CountBronzeMedals = (data: any) => {
    let count = 0;
    data?.results?.bindings.map((binding: any, i: number) => {
        const competitionLabel = binding.competitionsLabel?.value;
        const medalsLabel = binding.medalsLabel?.value;
        const rankingLabel = binding.ranking?.value;
        if (competitionLabel && competitionLabel.toLowerCase().includes("olymp") && rankingLabel === '3') {
            count++;
        }
    });
    return count;
}


function Athlete() {

    const {idParam} = useParams<{idParam: string}>(); // Récupère l'identifiant de l'athlète dans l'URL
    const [data, setData] = useState<any>();

    const fetchData = async () => {
        const base_endpoint = "https://query.wikidata.org/sparql";
        const query = `
        SELECT ?birthdate ?name ?nat ?gender ?birthplace ?birthplaceLabel ?image ?competitions ?competitionsLabel ?birthCountry ?birthCountryLabel
        ?medals ?medalsLabel ?medalImage ?ranking ?sport ?sportLabel ?birthCountryImage ?description ?titre
        ?height ?weight ?countryForSport ?countryForSportLabel ?countryForSportImage ?countryOfCitizenship ?countryOfCitizenshipLabel ?countryOfCitizenshipImage
        WHERE {
            BIND(wd:${idParam} AS ?person)
            OPTIONAL { ?person rdfs:label ?titre. FILTER(LANG(?titre) = "fr") }
            OPTIONAL { ?person wdt:P569 ?birthdate. }
            OPTIONAL { ?person wdt:P21 ?gender. }
            OPTIONAL { ?person wdt:P19 ?birthplace. }
            OPTIONAL { ?birthplace wdt:P17 ?birthCountry. }
            OPTIONAL { ?birthCountry wdt:P41 ?birthCountryImage. }
            OPTIONAL { ?person wdt:P641 ?sport. }
            OPTIONAL { ?person p:P1344 ?participation. }
            OPTIONAL { ?participation ps:P1344 ?competitions. }
            OPTIONAL { ?participation pq:P166 ?medals. }
            OPTIONAL { ?participation pq:P1352 ?ranking. }
            OPTIONAL { ?person schema:description ?description. FILTER(LANG(?description) = "fr") }
            SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
            OPTIONAL { ?person wdt:P18 ?image. }
            OPTIONAL { ?person wdt:P2048 ?height. }
            OPTIONAL { ?person wdt:P2067 ?weight. }
            OPTIONAL { ?person wdt:P27 ?countryOfCitizenship. }
            OPTIONAL { ?countryOfCitizenship wdt:P41 ?countryOfCitizenshipImage. }
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
            <div className="containerr">
                <h1 className="pp">
                    <strong>Nom :</strong> {data?.results?.bindings[0]?.titre?.value}
                    <br />
                    <strong>Nation représentée :</strong> {data?.results?.bindings[0]?.countryOfCitizenshipLabel?.value} {data?.results?.bindings[0]?.countryOfCitizenshipImage?.value && <img className="flagg" src={data?.results?.bindings[0]?.countryOfCitizenshipImage?.value} />}
                    <br />
                    <br />
                    <strong>Date de naissance :</strong> {data?.results?.bindings[0]?.birthdate?.value && formatDate(data?.results?.bindings[0]?.birthdate?.value)} (Âge : {data?.results?.bindings[0]?.birthdate?.value && Math.floor((new Date().getTime() - new Date(data?.results?.bindings[0]?.birthdate?.value).getTime()) / (1000 * 3600 * 24 * 365.25))} ans)
                    <br />
                    <strong>Sexe :</strong> {data?.results?.bindings[0]?.gender?.value === "http://www.wikidata.org/entity/Q6581097" ? "Homme" : "Femme"}
                    <br />
                    <strong>Lieu de naissance :</strong> {data?.results?.bindings[0]?.birthplaceLabel?.value} {data?.results?.bindings[0]?.birthCountryImage?.value && <img className="flagg" src={data?.results?.bindings[0]?.birthCountryImage?.value} />}
                    <br />
                    <strong>Description :</strong> {data?.results?.bindings[0]?.description?.value}
                    <br />
                    <strong>Disciplines :</strong> {data?.results?.bindings[0]?.sportLabel?.value}    
                    <br />
                    <strong>Taille :</strong> {data?.results?.bindings[0]?.height?.value} m  <strong>  Poids :</strong> {data?.results?.bindings[0]?.weight?.value} kg                
                </h1>

                <h2 className="imagee">
                    <img src={data?.results?.bindings[0]?.image?.value} />
                </h2>

            </div>
            <h3 className="compett">
                <strong>Palmarès Olympique :</strong> 
                <br />
                Total : <strong> {CountGoldMedals(data)} <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Gold Medal" />
                 {CountSilverMedals(data)} <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Silver Medal" />
                 {CountBronzeMedals(data)} <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/330px-Bronze_medal_olympic.svg.png" alt="Bronze Medal" />
                 </strong>

                {data?.results?.bindings.map((binding: any, i: number) => {
                    const competitionLabel = binding.competitionsLabel?.value;
                    const medalsLabel = binding.medalsLabel?.value;
                    const rankingLabel = binding.ranking?.value;
                    if (competitionLabel && competitionLabel.toLowerCase().includes("olymp")) {
                        return (
                            <p key={i}>
                                -
                                {rankingLabel === '1' && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Gold Medal" />}
                                {rankingLabel === '2' && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Silver Medal" />}
                                {rankingLabel === '3' && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/330px-Bronze_medal_olympic.svg.png" alt="Bronze Medal" />}
                                {rankingLabel && parseInt(rankingLabel) > 3 && <strong>  {rankingLabel}ème </strong>}
                                {competitionLabel}
                            </p>
                        );
                    }
                    return null;
                })}
            </h3>
            {data?.results?.bindings.length === 0 && <h4>Erreur : Aucune donnée trouvée</h4>}


        </div>
    );
}

export default Athlete;
