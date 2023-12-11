import { useEffect, useState } from "react";
import { EditionData, fetchEditionData, fetchSports } from "./edition.service";
import { useParams } from "react-router-dom";
import "./edition.css";
const Edition = () => {
  const params = useParams();
  const [data, setData] = useState<EditionData>();
  const [sports, setSports] = useState<string[]>([]);

  const handleFetchEditionData = async () => {
    const res = await fetchEditionData(params.edition);
    if (res) {
      setData(res);
    }
  };

  const handleFetchSports = async () => {
    const res = await fetchSports(params.edition);
    if(res){
      setSports(res);
    }

    console.log(res);
  }
  useEffect(() => {
    handleFetchEditionData();
    handleFetchSports();
  }, []);

  if (!data) {
    return <div>Not found</div>;
  }
  return (
    <div className="edition-container">
      <h1>{data?.edition}</h1>
      <div className="edition-hero">
        <div className="edition-information">
          <div className="edition-line">
            <h2>Lieu : </h2> {data?.location}, {data?.country}
          </div>
          <div className="edition-line">
            <h2>Nombre de participants : </h2> {data?.participants_count}
          </div>
          <div className="edition-line">
            <h2>Nombre de nations : </h2> {data?.nations_count}
          </div>
          <div className="edition-line">
            <h2>Nombre de sports : </h2> {data?.sports_count}
          </div>
          <div className="edition-line">
            <h2>Début : </h2> {data?.start_date}
          </div>
          <div className="edition-line">
            <h2>Fin : </h2> {data?.end_date}
          </div>
        </div>

        <img src={data?.logo_url} />
      </div>
      <div className="edition-sports">
        <ul>
          {sports.map((sport:string,index: number) =>(
            <li key={index}>
              {sport}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Edition;
