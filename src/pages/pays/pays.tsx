import './pays.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

interface QueryMedal {
  label: { value: string };
  totalGold: { value: string };
  totalSilver: { value: string };
  totalBronze: { value: string };
  olympicEdition: { value: string };
}

interface QueryCountry {
  name: { value: string };
  image: { value: string };
}

interface QueryAthlete {
  name: { value: string };
  sportif: { value: string };
}



function Pays() {
  const [medalData, setMedalData] = useState<QueryMedal[]>([]);
  const [countryData, setCountryData] = useState<QueryCountry[]>([]);
  const [athleteData, setAthleteData] = useState<QueryAthlete[]>([]);
  const { idPays } = useParams();
  const naviguate = useNavigate();
  
  const medalQuery = `
    SELECT ?olympicEdition ?label (SUM(?gold) as ?totalGold) (SUM(?silver) as ?totalSilver) (SUM(?bronze) as ?totalBronze)  WHERE {
      ?pays_edition wdt:P179 wd:${idPays}.
      ?pays_edition rdfs:label ?label.
      ?pays_edition wdt:P1344 ?olympicEdition.
      
      OPTIONAL {
        ?pays_edition p:P166 ?medalStatement.
        ?medalStatement ps:P166 ?medalType.
        ?medalStatement pq:P1114 ?medalCount.
    
        VALUES ?medalType { wd:Q15243387 wd:Q15889641 wd:Q15889643 }
        
        BIND(IF(?medalType = wd:Q15243387, ?medalCount, 0) AS ?gold)
        BIND(IF(?medalType = wd:Q15889641, ?medalCount, 0) AS ?silver)
        BIND(IF(?medalType = wd:Q15889643, ?medalCount, 0) AS ?bronze)
      }
      
      FILTER(lang(?label) = 'fr').
      FILTER(CONTAINS(?label, 'été')).
    }
    GROUP BY ?olympicEdition ?label
    ORDER BY (?label)    
    `;

    const countryQuery = `
    SELECT DISTINCT ?country ?name ?image WHERE {
      wd:${idPays} wdt:P17 ?country.
      ?country wdt:P41 ?image;
                rdfs:label ?name.
      FILTER(lang(?name) = 'fr')
    }
    `;

    const athleteQuery = `
    SELECT DISTINCT ?sportif ?name WHERE {
      ?pays_edition wdt:P179 wd:${idPays}.
      ?pays_edition wdt:P17 ?country.
      ?sportif wdt:P1532 ?country.
      ?sportif p:P1344 ?participation.
      ?participation ps:P1344 ?competitions.
      ?competitions rdfs:label ?nameCompetition.
      ?participation pq:P1352 ?ranking.
      ?sportif rdfs:label ?name.
      ?sportif wdt:P569 ?birthdate.
      FILTER(lang(?nameCompetition) = 'en')
      FILTER(lang(?name) = 'fr')
      FILTER(CONTAINS(?nameCompetition, 'Summer'))
      FILTER(?ranking <= 1)
      FILTER(?birthdate >= "1970-01-01T00:00:00Z"^^xsd:dateTime)
    }
    LIMIT 10
    `;

  const fetchData = async (query:string, setData:React.Dispatch<any>) => { // eslint-disable-line
    const base_endpoint = "https://query.wikidata.org/sparql";
    try {
      const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.results.bindings);
        console.log(result);
      } else {
        console.error("Erreur lors de la requête SPARQL");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const MedalTableRow: React.FC<{infos: QueryMedal}> = ({ infos }) => (
      <tr>
        <td className='link' onClick={() => {naviguate(`/edition/${infos.olympicEdition.value.substring(infos.olympicEdition.value.lastIndexOf('/') + 1)}`)}}><a>{infos.label.value.match(/\b\d{4}\b/)}</a></td>
        <td>{infos.totalGold.value}</td>
        <td>{infos.totalSilver.value}</td>
        <td>{infos.totalBronze.value}</td>
      </tr>
  );

  const AthleteRow: React.FC<{data: QueryAthlete}> = ({ data }) => (
    <li className='link' onClick={() => naviguate(`/athlete/${data.sportif.value.substring(data.sportif.value.lastIndexOf('/') + 1)}`)}>
      {data?.name?.value}<span> - </span>
    </li>
  );

  useEffect(() => {
    fetchData(medalQuery, setMedalData);
    fetchData(countryQuery, setCountryData);
    fetchData(athleteQuery, setAthleteData);
  }, []);
  
  
  


  return (
    <>
      <div className='countryInfo'>
          <div className='textCountry'>
            <div className='edition-sports'><h2>Pays : </h2>{countryData[0]?.name.value}</div>
            <div className='edition-sports'><h2>Nombre de participations aux JOs:</h2> {medalData?.length}</div>
            <div className='edition-sports'>
              <h2>Athlètes notables: </h2>
              {
                athleteData.length > 0 ? (
                  <ul>
                    {athleteData?.map((athlete, index) => (
                      <AthleteRow key={index} data={athlete} />
                    ))}
                  </ul>
                ) : (
                  <div> Loading </div>
                )
              }
            </div>
          </div>
        <div className='flag-container'>
          <img className='flag' src={countryData[0]?.image.value} alt="Drapeau" />
        </div>
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>
                Année
              </th>
              <th>
                <img className='medal' src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Médaille d'Or"/>
              </th>
              <th>
                <img className='medal' src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Médaille d'Argent"/>
              </th>
              <th>
                <img className='medal' src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/1920px-Bronze_medal_olympic.svg.png" alt="Médaille de Bronze"/>
              </th>
            </tr>
          </thead>
          <tbody>
            {medalData?.map((row:QueryMedal, index) => (
              <MedalTableRow key={index} infos={row} />
            ))}
          </tbody>
        </table>
      </div>
    </>   
  );
}

export default Pays;
