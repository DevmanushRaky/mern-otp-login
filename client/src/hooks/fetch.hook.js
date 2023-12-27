import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** custom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null })
 

    useEffect(() => {
       
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }));

                // Corrected conditional assignment to ensure username is not undefined
                const { username } = !query ? await getUsername() : { username: '' };
          

                // Corrected URL format by changing "user:" to "user/"
                const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);

                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading: false }));
                    setData(prev => ({ ...prev, apiData: data, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false }));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}