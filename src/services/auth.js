const AUTH_TOKEN = 'auth';

export const getAuth = () => JSON.parse(localStorage.getItem(AUTH_TOKEN));
export const setAuth = auth => localStorage.setItem(AUTH_TOKEN, JSON.stringify(auth));
export const deleteAuth = () => localStorage.removeItem(AUTH_TOKEN);