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
function Pays() {
  const [medalData, setMedalData] = useState<any>([]);
  const [countryData, setCountryData] = useState<any>([]);
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
      ?pays_edition wdt:P179 wd:${idPays}.
      ?pays_edition wdt:P17 ?country.
      ?country wdt:P1813 ?name.
      ?country wdt:P41 ?image.
    }
    `

  const fetchData = async (query:string, setData:React.Dispatch<any>) => {
    const base_endpoint = "https://query.wikidata.org/sparql";
    try {
      const response = await fetch(`${base_endpoint}?query=${encodeURIComponent(query)}&format=json`, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        console.log(result);
      } else {
        console.error("Erreur lors de la requête SPARQL");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const TableRow: React.FC<{infos: QueryMedal}> = ({ infos }) => (
      <tr>
        <td onClick={() => {naviguate(`/edition/${infos.olympicEdition.value.substring(infos.olympicEdition.value.lastIndexOf('/') + 1)}`)}}>{infos.label.value.match(/\b\d{4}\b/)}</td>
        <td>{infos.totalGold.value}</td>
        <td>{infos.totalSilver.value}</td>
        <td>{infos.totalBronze.value}</td>
      </tr>
  );
  useEffect(() => { 
    fetchData(medalQuery, setMedalData);
    fetchData(countryQuery, setCountryData);
    //fetchData(athleteQuery, setAthleteData);

   }, []);


  return (
    <>
      <div className='countryInfo'>
      <h1>Pays : {countryData?.results?.bindings[0].name.value}</h1>
      <img className='flag' src={countryData?.results?.bindings[0].image.value} alt="Drapeau" />
      </div>
      <table>
        <thead>
          <tr>
            <th>
              Année
            </th>
            <th>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gold_medal_olympic.svg/330px-Gold_medal_olympic.svg.png" alt="Médaille d'Or"/>
            </th>
            <th>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Silver_medal_olympic.svg/330px-Silver_medal_olympic.svg.png" alt="Médaille d'Argent"/>
            </th>
            <th>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bronze_medal_olympic.svg/1920px-Bronze_medal_olympic.svg.png" alt="Médaille de Bronze"/>
            </th>
          </tr>
        </thead>
        <tbody>
          {medalData?.results?.bindings.map((row:QueryMedal, index) => (
            <TableRow key={index} infos={row} />
          ))}
        </tbody>
      </table>
    </>   
  );
}

export default Pays;
