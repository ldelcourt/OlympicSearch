import { useEffect, useState } from "react";
import { EditionData, fetchEditionData } from "./edition.service";
import { useParams } from "react-router-dom";

const Edition = () => {

    const params = useParams();
    const [data, setData] = useState<EditionData>();

    const handleFetchEditionData = async () => {
        const res = await fetchEditionData(params.edition);
        if(res){
            setData(res);
        }
    }
    useEffect(() => {
        handleFetchEditionData();
    },[])
    
    if(!data){
        return(
            <div>
                Not found
            </div>
        )
    }
    return(
        <div className="m-4 flex flex-col items-center">
           <h1>{data?.edition}</h1>
            <img src={data?.logo_url}/>
            <p>Ville hôte : {data?.location}, {data?.country}</p>
            <p>{data?.participants_count} participants</p>
            <p>{data?.nations_count} nations</p>
            <p>{data?.sports_count} sports</p>
        </div>
    )
}

export default Edition;