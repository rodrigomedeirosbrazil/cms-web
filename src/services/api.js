import axios from 'axios';

const api = axios.create(
    {
        baseURL: 'https://rocky-springs-43056.herokuapp.com'
    }
);

export default api;