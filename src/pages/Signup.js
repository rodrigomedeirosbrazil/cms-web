import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import api from '../services/api';
import logo from '../assets/medeirostec_logo.png'

export default function Login({ history }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [getError, setError] = useState('');
    
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/signup', { name, email, password });
            localStorage.setItem('user', JSON.stringify(response.data.data));
            history.push('Main');
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
                    <h1 className="text-center p-2">Cadastro</h1>
                    <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Digite seu nome" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                        />
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
                    <button type="submit" disabled={loading} className="btn btn-primary btn-block" ><span><FontAwesomeIcon icon={faUserPlus}  size="lg"/></span> Cadastrar</button>
                    <div className="p-2 text-center">
                        {loading && (<span><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>)}
                        {getError && (<span>{getError}</span>)}
                    </div>
                </form>
            </div>
        </div>
    );
}