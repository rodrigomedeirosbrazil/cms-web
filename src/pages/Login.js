import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';

import api from '../services/api';
import { setAuth, deleteAuth } from '../services/auth';
import logo from '../assets/medeirostec_logo.png'

export default function Login({ history }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [getError, setError] = useState('');

    useEffect(
        () => {
            deleteAuth();
        }
    , [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            if(response.data) {
                setAuth(response.data.data);
                history.push('Main');
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log('erro', error.response);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Não foi possível fazer Login, tente novamente mais tarde.');
            }
        }
        setLoading(false);
    }

    return (
        <div className="container h-100 d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column align-items-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <img src={logo} alt="MedeirosTEC" />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Digite seu email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Digite sua senha"
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading} block ><span><FontAwesomeIcon icon={faSignInAlt}  size="lg"/></span> Entrar</Button>
                    <div className="p-2 text-center">
                        {loading && (<span><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>)}
                        {getError && (<span>{getError}</span>)}
                    </div>
                    <div className="p-2 text-center">
                        Não tem conta? <Button type="submit" href="/signup" variant="outline-info"><span><FontAwesomeIcon icon={faUserPlus}  size="lg"/></span> Cadastre-se</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}