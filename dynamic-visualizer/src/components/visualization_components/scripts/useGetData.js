import {useEffect, useState} from "react";
import axios from "axios";


/**
 * custom hook: function to get the data from server
 * @param url
 * @returns data
 */
function useGetData(url){

    const [data, setData] = useState("Noch keine Datan da");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        // async function must be defined and then called immediately here. Otherwise(anonymous function) doesnt work
        async function fetchData() {
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                setError(error.message);
                setData(null);
            } finally {
                setLoading(false);
            }

        }
        fetchData();
    });

    return data
}

export default useGetData;