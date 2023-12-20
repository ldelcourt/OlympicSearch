import { useState } from "react";
import { useEffect } from "react";


import { useParams, useNavigate } from "react-router-dom";
import './athlete.css';
import { FecthResult, QueryValue } from "../../interfaces";


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

let test = 0;

const CountGoldMedals = (athleteData: any) => {
    let count = 0;
    athleteData?.results?.bindings.map((binding: any, i: number) => {
        const competitionLabel = binding.competitionsLabel?.value;
        const medalsLabel = binding.medalsLabel?.value;
        const rankingLabel = binding.ranking?.value;
        if (competitionLabel && competitionLabel.toLowerCase().includes("olymp") && rankingLabel === '1') {
            count++;
        }else if(medalsLabel && medalsLabel.includes("or ol")){
            count++;
        }
    });
    return count;
}

const CountSilverMedals = (athleteData: any) => {
    let count = 0;
    athleteData?.results?.bindings.map((binding: any, i: number) => {
        const competitionLabel = binding.competitionsLabel?.value;
        const medalsLabel = binding.medalsLabel?.value;
        const rankingLabel = binding.ranking?.value;
        if (competitionLabel && competitionLabel.toLowerCase().includes("olymp") && rankingLabel === '2') {
            count++;
        }else if(medalsLabel && medalsLabel.includes("argent ol")){
            count++;
        }
    });
    return count;
}

const CountBronzeMedals = (athleteData: any) => {
    let count = 0;
    athleteData?.results?.bindings.map((binding: any, i: number) => {
        const competitionLabel = binding.competitionsLabel?.value;
        const medalsLabel = binding.medalsLabel?.value;
        const rankingLabel = binding.ranking?.value;
        if (competitionLabel && competitionLabel.toLowerCase().includes("olymp") && rankingLabel === '3') {
            count++;
        }else if(medalsLabel && medalsLabel.includes("bronze ol")){
            count++;
        }
    });
    return count;
}

interface CountryQueryResult {
    id: QueryValue;
    name: QueryValue;
}

function Athlete() {
    const [texteSaisie, setTexteSaisie] = useState<string>();
    const naviguate = useNavigate();
    const { idParam } = useParams<{ idParam: string }>(); // Récupère l'identifiant de l'athlète dans l'URL
    const [athleteData, setAthleteData] = useState<any>();
    const [countryData, setCountryData] = useState<FecthResult<CountryQueryResult>>();


    const fetchData = async () => {
        const base_endpoint = "https://query.wikidata.org/sparql";
        const query = `
        SELECT DISTINCT ?birthdate ?name ?nat ?gender ?birthplace ?birthplaceLabel ?image ?competitions ?competitionsLabel ?birthCountry ?birthCountryLabel
        ?medals ?medalsLabel ?medalImage ?ranking ?sport ?sportLabel ?birthCountryImage ?description ?titre
        ?height ?weight ?countryForSport ?countryForSportLabel ?countryForSportImage ?countryOfCitizenship ?countryOfCitizenshipLabel ?countryOfCitizenshipImage
        ?instanceOfCompetitions ?instanceOfCompetitionsLabel 
        ?sportInEdition ?OlympicEdition ?OlympicEditionLabel ?FurtherEdition ?FurtherEditionLabel
        ?instanceOfEdition ?instanceOfEditionLabel ?instanceOfFurtherEdition ?instanceOfFurtherEditionLabel
        ?epreuve ?epreuveLabel 

    
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

            OPTIONAL { ?participation pq:P805 ?epreuve. }

            OPTIONAL { ?competitions wdt:P31 ?instanceOfCompetitions. }
            

            OPTIONAL { ?participation pq:P166 ?medals. }
            OPTIONAL { ?participation pq:P1352 ?ranking. }



            OPTIONAL { ?person schema:description ?description. FILTER(LANG(?description) = "fr") }
            SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
            OPTIONAL { ?person wdt:P18 ?image. }
            OPTIONAL { ?person wdt:P2048 ?height. }
            OPTIONAL { ?person wdt:P2067 ?weight. }
            OPTIONAL { ?person wdt:P27 ?countryOfCitizenship. }
            OPTIONAL { ?countryOfCitizenship wdt:P41 ?countryOfCitizenshipImage. }
            OPTIONAL { ?person wdt:P1532 ?countryForSport. 
                OPTIONAL { ?countryForSport wdt:P41 ?countryForSportImage. }
            } 
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
              CONTAINS(?pageName, "France" )  
            ).
        
        OPTIONAL { ?country schema:description ?description }
        OPTIONAL { ?country wdt:P41 ?imageSrc }
        OPTIONAL { ?country rdfs:label ?title }
        FILTER(lang(?description) = 'fr' && LANG(?title) = "fr")
    
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "fr".
          }
        } 
      `;


        try {
            const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
                method: "GET",
            });

            
            if (response.ok) {
                const result = await response.json();
                console.log({ result });
                setAthleteData(result);
            }

        } catch (error) {
            console.error(error);
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


    const countryForSport = athleteData?.results?.bindings[0]?.countryForSport?.value;
    if(countryForSport !== undefined ){
        console.log(countryForSport);
    }

    const sport = athleteData?.results?.bindings[0]?.sport?.value;

    return (
        <div>
            <div className="containerr">
                <h1 className="pp">
                    <strong>Nom :</strong> {athleteData?.results?.bindings[0]?.titre?.value}
                    <br />
                    <strong>Nation représentée :  {athleteData?.results?.bindings[0]?.countryForSportLabel?.value}</strong> {athleteData?.results?.bindings[0]?.countryForSportImage?.value && <img className="flagg" src={athleteData?.results?.bindings[0]?.countryForSportImage?.value} />} {athleteData?.results?.bindings[0]?.countryForSportLabel ===undefined && <strong> {athleteData?.results?.bindings[0]?.countryOfCitizenshipLabel?.value} {athleteData?.results?.bindings[0]?.countryOfCitizenshipImage?.value && <img className="flagg" src={athleteData?.results?.bindings[0]?.countryOfCitizenshipImage?.value} />}</strong>}

                    <br />
                    <br />
                    <strong>Date de naissance :</strong> {athleteData?.results?.bindings[0]?.birthdate?.value && formatDate(athleteData?.results?.bindings[0]?.birthdate?.value)} (Âge : {athleteData?.results?.bindings[0]?.birthdate?.value && Math.floor((new Date().getTime() - new Date(athleteData?.results?.bindings[0]?.birthdate?.value).getTime()) / (1000 * 3600 * 24 * 365.25))} ans)
                    <br />
                    <strong>Sexe :</strong> {athleteData?.results?.bindings[0]?.gender?.value === "http://www.wikidata.org/entity/Q6581097" ? "Homme" : "Femme"}
                    <br />
                    <strong>Lieu de naissance :</strong> {athleteData?.results?.bindings[0]?.birthplaceLabel?.value} {athleteData?.results?.bindings[0]?.birthCountryImage?.value && <img className="flagg" src={athleteData?.results?.bindings[0]?.birthCountryImage?.value} />}
                    <br />
                    <strong>Description :</strong> {athleteData?.results?.bindings[0]?.description?.value}
                    <br />
                    <strong>Disciplines : </strong> 
                    <span className="link" onClick={() => naviguate(`/sport/${sport.substring(sport.lastIndexOf('/') + 1)}`)}>
                                    {athleteData?.results?.bindings[0]?.sportLabel?.value
                                    }
                                </span>
                    <br />
                    <strong>Taille :</strong> {athleteData?.results?.bindings[0]?.height?.value} m  
                    {athleteData?.results?.bindings[0]?.weight?.value && <span><strong>  Poids :</strong> {athleteData?.results?.bindings[0]?.weight?.value} kg</span>}
                    {!athleteData?.results?.bindings[0]?.weight?.value && <span><strong>  Poids :</strong> inconnu </span>}

                </h1>

                <h2 className="imagee">
                    <img src={athleteData?.results?.bindings[0]?.image?.value} />
                </h2>

            </div>
            <h3 className="compett">
                <strong>Palmarès Olympique :</strong>
                <br />
                Total : <strong> {CountGoldMedals(athleteData)} <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Gold Medal" />
                    {CountSilverMedals(athleteData)} <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Silver Medal" />
                    {CountBronzeMedals(athleteData)} <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/330px-Bronze_medal_olympic.svg.png" alt="Bronze Medal" />
                </strong>
                
                {athleteData?.results?.bindings.map((binding: any, i: number) => {
                    const competitionLabel = binding.competitionsLabel?.value;
                    const competition = binding.competitions?.value;
                    const medalsLabel = binding.medalsLabel?.value;
                    const rankingLabel = binding.ranking?.value;
                    const instanceOfCompetitionsLabel = binding.instanceOfCompetitionsLabel?.value;
                    const edition = binding.OlympicEdition?.value;
                    const furtherEdition= binding.FurtherEdition?.value;
                    const instanceOfEditionLabel = binding.instanceOfEditionLabel?.value;
                    const instanceOfFurtherEditionLabel = binding.instanceOfFurtherEditionLabel?.value;
                    const epreuveLabel = binding.epreuveLabel?.value;
                    const awardLabel = binding.awardLabel?.value;
                    if (competitionLabel && competitionLabel.toLowerCase().includes("olymp")) {
                        return (
                            <p key={i}>
                                -
                                {rankingLabel === '1' && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Gold Medal" />}
                                {rankingLabel === '2' && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Silver Medal" />}
                                {rankingLabel === '3' && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/330px-Bronze_medal_olympic.svg.png" alt="Bronze Medal" />}
                                {rankingLabel && parseInt(rankingLabel) > 3 && <strong>  {rankingLabel}ème </strong>}
                                {instanceOfCompetitionsLabel === "Jeux olympiques d’été" && 
                                <span className="link" onClick={() => naviguate(`/edition/${competition.substring(competition.lastIndexOf('/') + 1)}`)}>
                                    {competitionLabel
                                    }
                                </span>
                                }
                                <span> 
                                    
                                    {instanceOfEditionLabel === "Jeux olympiques d’été" && <strong>1 {edition} </strong>}
                                    {instanceOfFurtherEditionLabel === "Jeux olympiques d’été" && <strong>2 {furtherEdition} </strong>} 

                                </span>
                                {(!rankingLabel && medalsLabel && medalsLabel.includes("or")) && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Gold Medal" />}  
                                {(!rankingLabel && medalsLabel && medalsLabel.includes("argent")) && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Silver Medal" />}
                                {(!rankingLabel && medalsLabel && medalsLabel.includes("bronze")) && <img className="medaillee" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/330px-Bronze_medal_olympic.svg.png" alt="Bronze Medal" />}

                                {instanceOfCompetitionsLabel !== "Jeux olympiques d’été" && <span>{competitionLabel}</span>}
                                {epreuveLabel && <span> ({epreuveLabel})</span>} 
                            </p>    
                        );
                    }
                    return null;
                })}
            </h3>
            {athleteData?.results?.bindings.length === 0 && <h4>Erreur : Aucune donnée trouvée</h4>}


        </div>
    );
}

export default Athlete;
