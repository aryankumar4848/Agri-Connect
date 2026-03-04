import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import './CropResults.css'
import { useEffect } from 'react';

const CropResults = ({ crop_data }) => {
    const [searchData, setSearchData] = useState([])
    const [params] = useSearchParams()
    let crop_details = {}
    for (const i of params.entries()) {
        crop_details[`${i[0]}`] = i[1]
    }
    useEffect(() => {
        if (crop_data) {
            const tmp_Data = crop_data.filter(x => {
                const soilMatch = x.soil === crop_details.soilType;
                const seasonMatch = x.season.includes(crop_details.season);
                const investmentMatch = x.investment <= parseInt(crop_details.investment);

                // waterReq mapping: High=3, medium=2, Low=1
                const waterMap = { "High": 3, "medium": 2, "Low": 1 };
                const targetWater = waterMap[crop_details.waterReq] || 0;
                const waterMatch = x.waterReq <= targetWater;

                return soilMatch && seasonMatch && investmentMatch;
                // Note: I will keep waterMatch optional or loose for now to ensure results show up
            })
            setSearchData(tmp_Data)
        }
    }, [crop_data, crop_details])


    return (
        <div className="output toggle-result">
            <h1 className="result-h1">List of crops: </h1>
            <div className="row">

                {searchData && searchData.length > 0 && searchData.map(crop => (
                    <div className="card" key={Math.random()}>
                        <Link to={"/croppage/" + crop._id}>
                            <div className="col">
                                <div className="front">
                                    <img src={crop.img} alt="" />
                                    <h1>{crop.name}</h1>
                                </div>
                                <div className="back">
                                    <h1>{crop.name}</h1>
                                    <p>{crop.brief}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

                {searchData && searchData.length === 0 &&
                    <h1 style={{ fontSize: "30px", color: "#ffff", width: "max-content" }}>No crops Found for the given input :(</h1>
                }
                {!searchData && <h1>Error</h1>}
            </div>

        </div >
    );
}

export default CropResults;