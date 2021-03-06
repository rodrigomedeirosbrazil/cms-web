import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faUserPlus, faLock } from '@fortawesome/free-solid-svg-icons'
import { LinkContainer as Link } from 'react-router-bootstrap'

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
                    <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                        {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>) 
                        : (<span><FontAwesomeIcon icon={faSignInAlt}  size="lg"/></span> )}
                        &nbsp;Entrar
                    </button>
                    <div className="p-2 text-center text-danger">
                        {getError && (<span>Erro: {getError}</span>)}
                    </div>
                    <div className="p-2 text-center">
                        <Link to="/recovery_password"><button type="button" className="btn btn-outline-info btn-block"><span><FontAwesomeIcon icon={faLock} size="lg" /></span> Esqueci a senha</button></Link>
                    </div>
                    <div className="p-2 text-center">
                        Não tem conta? <Link to="/signup"><button type="button" className="btn btn-outline-info btn-block"><span><FontAwesomeIcon icon={faUserPlus} size="lg" /></span> Cadastre-se</button></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}