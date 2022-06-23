import {useEffect, useState} from "react";
import axios from "axios";


/**
 * custom hook: function to get the data from server
 * @param url
 * @returns data is jsonobject
 */
function useGetData(url){


    const [response, setResponse] = useState({data: [0], labels: ["ladet"]});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        // async function must be defined and then called immediately here. Otherwise(anonymous function) doesnt work
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setResponse(response.data);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }

        }
        fetchData();
    }, []);

    return {response, loading};
}

export default useGetData;