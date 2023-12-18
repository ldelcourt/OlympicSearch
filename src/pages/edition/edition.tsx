import { useEffect, useState } from "react";
import {
  EditionData,
  Ranking,
  fetchEditionData,
  fetchEditionsLink,
  fetchRanking,
  fetchSports,
} from "./edition.service";
import { Link, useParams } from "react-router-dom";
import "./edition.css";
import "../../index.css";
const Edition = () => {
  const params = useParams();
  const [data, setData] = useState<EditionData>();
  const [editionLinks, setEditionLinks] = useState<
    { previous: string; next: string } | undefined
  >();
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("total");
  const handleFetchEditionData = async () => {
    const res = await fetchEditionData(params.edition);
    console.log({res});
    if (res) {
      setData(res);
    }
  };

  const handleFetchSports = async () => {
    const res = await fetchSports(params.edition);
    if (res) {
      setSports(res);
    }
  };

  const handleFetchEditionLinks = async () => {
    const res = await fetchEditionsLink(params.edition);
    if (res) {
      setEditionLinks(res);
    }
  };

  const handleFetchRanking = async () => {
    const res = await fetchRanking(params.edition);
    if (res) {
      const sorted_ranking = res.sort((a: Ranking, b: Ranking) => {
        const totalA = a.gold + a.silver + a.bronze;
        const totalB = b.gold + b.silver + b.bronze;

        return totalB - totalA;
      });
      setRanking(sorted_ranking);
    }
  };

  const loadData = async () => {
    setLoading(true);
    handleFetchEditionData();
    handleFetchSports();
    handleFetchEditionLinks();
    handleFetchRanking();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
  };

  const handleSort = (column: string) => {
    let sortRanking;
    if (column === "total") {
      sortRanking = ranking.sort((a: Ranking, b: Ranking) => {
        const totalA = a.gold + a.silver + a.bronze;
        const totalB = b.gold + b.silver + b.bronze;
        return currentFilter === 'total' ? totalA - totalB : totalB - totalA ;
      });
    } else {
      if (typeof ranking[0][column] === "number") {
        sortRanking = ranking.sort((a, b) => currentFilter == column ? a[column] - b[column] : b[column] - a[column]);
      } else {
        sortRanking = ranking.sort((a, b) => {
          const valueA = a[column].toLowerCase();
          const valueB = b[column].toLowerCase();
          if (valueA > valueB) {
            return currentFilter === "country" ? -1 : 1;
          }
          if (valueA < valueB) {
            return currentFilter === "country" ? 1 : -1;
          }
          return 0;
        });
      }
    }
    setCurrentFilter(currentFilter === column ? `-${column}` : column);
    setRanking([...sortRanking]);
  };

  useEffect(() => {
    loadData();
  }, [params]);

  if (loading) {
    return <div className="loader"></div>;
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
        {data?.logo_url ? <img src={data?.logo_url}/> : data?.second_logo_url ? <img src={data?.second_logo_url}/> : null}
      </div>
      <div className="edition-sports">
        <h2>Liste des sports</h2>
        <ul>
          {sports.map((sport: string, index: number) => (
            <li key={index}>
              {sport} <span> - </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="edition-ranking">
        <div>
          <div className="ranking-head">
            <div className="nation-head">
              Nation{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleSort("country")}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 9l4 -4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4 -4m4 4v-14" />
              </svg>
            </div>
            <div className="medal-head">
              Or{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleSort("gold")}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 9l4 -4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4 -4m4 4v-14" />
              </svg>
            </div>
            <div className="medal-head">
              Argent{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleSort("silver")}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 9l4 -4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4 -4m4 4v-14" />
              </svg>
            </div>
            <div className="medal-head">
              Bronze{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleSort("bronze")}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 9l4 -4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4 -4m4 4v-14" />
              </svg>{" "}
            </div>
            <div className="medal-head">
              Total
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleSort("total")}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 9l4 -4l4 4m-4 -4v14" />
                <path d="M21 15l-4 4l-4 -4m4 4v-14" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          {ranking.map((nation: Ranking, index: number) => (
            <div className="ranking-row" key={index}>
              <div className="nation-cell">{nation.country}</div>
              <div className="gold-medal">
                <a>{nation.gold ?? 0}</a>
              </div>
              <div className="silver-medal">
                <a>{nation.silver ?? 0}</a>
              </div>
              <div className="bronze-medal">
                <a>{nation.bronze ?? 0}</a>
              </div>
              <div className="total-medal">
                {nation?.bronze + nation?.silver + nation?.gold ?? 0}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="edition-links">
        <Link to={`../edition/${editionLinks?.previous}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 2a10 10 0 0 1 .324 19.995l-.324 .005l-.324 -.005a10 10 0 0 1 .324 -19.995zm.707 5.293a1 1 0 0 0 -1.414 0l-4 4a1.048 1.048 0 0 0 -.083 .094l-.064 .092l-.052 .098l-.044 .11l-.03 .112l-.017 .126l-.003 .075l.004 .09l.007 .058l.025 .118l.035 .105l.054 .113l.043 .07l.071 .095l.054 .058l4 4l.094 .083a1 1 0 0 0 1.32 -1.497l-2.292 -2.293h5.585l.117 -.007a1 1 0 0 0 -.117 -1.993h-5.586l2.293 -2.293l.083 -.094a1 1 0 0 0 -.083 -1.32z"
              strokeWidth="0"
              fill="#000000"
            />
          </svg>
          Previous
        </Link>
        <Link to={`../edition/${editionLinks?.next}`}>
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 2l.324 .005a10 10 0 1 1 -.648 0l.324 -.005zm.613 5.21a1 1 0 0 0 -1.32 1.497l2.291 2.293h-5.584l-.117 .007a1 1 0 0 0 .117 1.993h5.584l-2.291 2.293l-.083 .094a1 1 0 0 0 1.497 1.32l4 -4l.073 -.082l.064 -.089l.062 -.113l.044 -.11l.03 -.112l.017 -.126l.003 -.075l-.007 -.118l-.029 -.148l-.035 -.105l-.054 -.113l-.071 -.111a1.008 1.008 0 0 0 -.097 -.112l-4 -4z"
              strokeWidth="0"
              fill="#000"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Edition;
