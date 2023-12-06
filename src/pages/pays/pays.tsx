import './pays.css';
import { useParams } from 'react-router-dom';
import React from 'react';


function Pays() {
  //const [data, setData] = useState([]);
  const { nomPays } = useParams();
  
  /*
  SELECT ?name WHERE {
    ?e dcterms:subject <http://dbpedia.org/resource/Category:Summer_Olympics_by_year>.
    ?e rdfs:label ?name.
    FILTER(lang(?name) = 'fr')
  }
ORDER BY (?name)
  */

  return (
    <>
      <div>
      <h1>Param : {nomPays}</h1>
      </div>
    </>   
  );
}

export default Pays;
