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
        <div className="m-4 flex flex-col items-center gap-8">
           <h1>{data?.edition}</h1>
           <div className="flex justify-between">
           <div className="w-80 p-2 bg-blue flex flex-col gap-2">
                <div className="flex gap-2 items-center ">
                    <h2 className="font-semibold">Lieu : </h2> {data?.location}, {data?.country}
                </div>
                <div className="flex gap-2 items-center ">
                    <h2 className="font-semibold">Nombre de participants : </h2> {data?.participants_count}
                </div>
                <div className="flex gap-2 items-center ">
                    <h2 className="font-semibold">Nombre de nations : </h2> {data?.nations_count}
                </div>
                <div className="flex gap-2 items-center ">
                    <h2 className="font-semibold">Nombre de sports : </h2> {data?.sports_count}
                </div>
                <div className="flex gap-2 items-center ">
                    <h2 className="font-semibold">Début : </h2> {data?.start_date}
                </div>
                <div className="flex gap-2 items-center ">
                    <h2 className="font-semibold">Fin : </h2> {data?.end_date}
                </div>
           </div>
                
            <img className="w-1/2" src={data?.logo_url}/>
           </div>
        </div>
    )
}

export default Edition;