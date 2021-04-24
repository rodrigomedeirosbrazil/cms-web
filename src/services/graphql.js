import axios from 'axios';

import { getAuth } from '../services/auth';

const GRAPHQL_ENDPOINT = 'https://cms-medeirostec.herokuapp.com/v1/graphql';

const graphql = (query, variables = {}) => {
    const auth = getAuth();

    return axios.post(GRAPHQL_ENDPOINT, {
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
        return resp.data.data;
    });
};

export default graphql;
