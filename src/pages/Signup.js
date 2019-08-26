import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import './Login.css';
import logo from '../assets/medeirostec_logo.png'

const SIGNUP = gql`
    mutation signup($name: String!, $email: String!, $password: String!) {
        login(name: $name, email: $email, password: $password )
    }
`;

export default function Login({ history }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signup, { loading: signupLoading, error: signupError }] = useMutation(SIGNUP, 
        {
            onCompleted: onSignupCompleted,
        }
    );
    
    function onSignupCompleted (data) {
        console.log(data)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        signup({ variables: { name, email, password } });
        //history.push('/main');
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="MedeirosTEC" />
                <h1>Cadastro</h1>
                <input 
                    placeholder="Digite seu nome" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                />
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
                <button type="submit" disabled={signupLoading}>Cadastrar</button>
                {signupLoading && (<span><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>)}
                {signupError && (<span>Não foi possível fazer o cadastro.</span>)}
            </form>
        </div>
    );
}