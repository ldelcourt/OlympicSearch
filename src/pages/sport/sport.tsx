import React, { useState } from "react";
import { useEffect } from "react";


import { useNavigate, useParams } from "react-router-dom";
import './sport.css';
import { FecthResult, QueryValue } from "../../interfaces";



interface SportQueryResult {
    name?: QueryValue;
    icon?: QueryValue;
    description?: QueryValue;    
    pays?: QueryValue;
    paysLabel?: QueryValue;
}

interface AthleteQueryResult {
    id: QueryValue;
    name: QueryValue;
}

function Sport() {

    const naviguate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const { idSport } = useParams<{ idSport?: string }>();
    const [sportData, setSportData] = useState<FecthResult<SportQueryResult>>();
    const [athleteData, setAthleteData] = useState<FecthResult<AthleteQueryResult>>();

    const sportQuery = `
        SELECT ?name ?icon ?description ?pays ?paysLabel
        WHERE {
            wd:${idSport} rdfs:label ?name;
                    schema:description ?description.
            OPTIONAL { wd:${idSport} wdt:P495 ?pays }
            OPTIONAL { wd:${idSport} wdt:P2910 ?icon }
            FILTER(LANG(?name) = 'fr' && LANG(?description) = 'fr').
            SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
        }
        `;
        
    const athleteQuery = `
    SELECT DISTINCT ?id ?name
    WHERE {
      wd:${idSport} p:P3095 ?tempSportiveName.
      ?tempSportiveName ps:P3095 ?sportiveName.
      ?id p:P106 ?occupation.
      ?occupation ps:P106 ?sportiveName.
      ?id p:P1344 ?participation;
               wdt:P569 ?birthdate;
               rdfs:label ?name.
      ?participation pq:P166 wd:Q15243387.
      FILTER(LANG(?name) = 'fr'). 
      FILTER(?birthdate >= "1970-01-01T00:00:00Z"^^xsd:dateTime)
    
      }
    LIMIT 10
            `;
        

    const fetchData = async (query: string, setData: React.Dispatch<any> ) => { // eslint-disable-line
        const base_endpoint = "https://query.wikidata.org/sparql";
        

        setLoading(true);
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
        } finally{
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchData(sportQuery, setSportData);
        fetchData(athleteQuery, setAthleteData);
    }, []);

    const AthleteRow: React.FC<{athlete?: AthleteQueryResult}> = ({ athlete }) => (
        <li className='hoverable' onClick={() => naviguate(`/athlete/${athlete?.id.value.substring(athlete.id.value.lastIndexOf('/') + 1)}`)}>
          {athlete?.name.value}<span> - </span>
        </li>
      );

      if (loading) {
        return <div className="loader"></div>;
      }
    return (
        <div className="sport-container">
            <h1>{sportData?.results?.bindings[0]?.name?.value.charAt(0).toUpperCase()}{sportData?.results?.bindings[0]?.name?.value.slice(1).toLowerCase()}</h1>
            <div className="sport-hero">
                <div className="sport-information">
                    {
                        sportData?.results?.bindings[0]?.paysLabel &&
                    <div className="sport-line">
                        <h2> Pays d'origine : </h2> {sportData?.results?.bindings[0]?.paysLabel?.value}
                    </div>
                    }
                    <div className="sport-line">
                        <h2> Description : </h2> {sportData?.results?.bindings[0]?.description?.value}     
                    </div>
                </div>
                <img src={sportData?.results?.bindings[0]?.icon?.value} />
            </div>
            <div className='sport-athletes'>
                <h2>Athlètes notables: </h2>
                {
                    athleteData?.results?.bindings && athleteData?.results?.bindings?.length > 0 ? (
                    <ul>
                        {athleteData?.results?.bindings.map((athlete, index) => (
                        <AthleteRow key={index} athlete={athlete} />
                        ))}
                    </ul>
                    ) : (
                    <div> Loading </div>
                    )
                }
            </div>
            <br />
            <div style={{ textAlign: 'center' }}>
                {sportData?.results?.bindings.length === 0 ? <p>Aucune donnée trouvée</p> : <p>Sources : Wikidata </p>}
            </div>
        </div>
    );
}

export default Sport;
