import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

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
    const [login] = useMutation(LOGIN);
    

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await login({ variables: { email, password } });
        console.log(res);
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
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
