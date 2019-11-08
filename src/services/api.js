import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'https://cms-medeirostec.herokuapp.com'
    }
);

export default api;