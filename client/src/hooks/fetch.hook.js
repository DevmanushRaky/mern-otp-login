/* eslint-disable */
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


//  custome hook
export default function useFetch(query) {
    
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {
        if (!query) return;

        const fechData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }))

                const { data, status } = await axios.get(`/api/${query}`)
                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading: false }))
                    setData(prev => ({ ...prev, apiData: data, status: status }))
                }
                setData(prev => ({ ...prev, isLoading: false }))
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        }
        fechData()
    },[query])

    return { getData, setData};
}