import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import './Login.css';
import logo from '../assets/medeirostec_logo.png'

const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password )
    }
`;

export default function Login({ history }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN, 
        {
            onCompleted: onLoginCompleted,
        }
    );
    
    function onLoginCompleted (data) {
        console.log(data)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        login({ variables: { email, password } });
        //history.push('/main');
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="MedeirosTEC" />
                <input 
                    placeholder="Digite seu email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Digite sua senha"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loginLoading}>Enviar</button>
                {loginLoading && (<span><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>)}
                {loginError && (<span>Email ou senha incorretos.</span>)}
            </form>
        </div>
    );
}