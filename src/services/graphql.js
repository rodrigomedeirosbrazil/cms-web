import axios from 'axios';

import { getAuth } from '../services/auth';


const graphql = (query, variables = {}) => {
    const auth = getAuth();

    return axios.post(
        process.env.REACT_APP_BASE_URL + '/v1/graphql', 
        {
        query,
        variables: {
            ...variables,
        },
    },
    {
        headers: {
            Authorization: 'Bearer ' + (auth ? auth.token : '')
        } 
    }).then(resp => {
        if (resp.data.errors) {
            throw resp.data.errors[0];
        }

        return resp.data.data;
    });
};

export default graphql;
