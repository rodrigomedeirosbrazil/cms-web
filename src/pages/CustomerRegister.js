import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';

import logo from '../assets/medeirostec_logo.png'
import { getAuth } from '../services/auth';

const REGISTER = gql`
    mutation ($name: String!, $email: String, $address: String, $city: String, $state: String, $zip: String, $user_id: Int!) {
        insert_customers(objects: {name: $name, email: $email, address: $address, city: $city, zip: $zip, user_id: $user_id}) {
          returning { id }
        }
    }
`;

export default function CustomerRegister({ history }) {
    const [user_id, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [loading, setLoading] = useState(false);
    const [register] = useMutation(REGISTER);

    useEffect(
        () => {
            const auth = getAuth();
            if (auth) {
                setUserId(auth.user.id);
            }
        }
    , [])
    
    // function onCompleted (data) {
    //     setLoading(false);
    //     console.log(data)
    // }

    // function onError (data) {
    //     setLoading(false);
    //     console.log(data)
    // }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        register({ variables: { name, email, address, city, state, zip, user_id } });
        setLoading(false);

        //history.push('/main');
    }

    return (
        <div className="container h-100 d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column align-items-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <img src={logo} alt="MedeirosTEC" />
                    </div>
                    <h1 className="text-center p-2">Cadastro de Cliente</h1>
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
                            type="zip" 
                            className="form-control" 
                            placeholder="Digite seu CEP" 
                            value={zip} 
                            onChange={e => setZip(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="address" 
                            className="form-control" 
                            placeholder="Digite seu endereço completo" 
                            value={address} 
                            onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="state" 
                            className="form-control" 
                            placeholder="Digite seu Estado" 
                            value={state} 
                            onChange={e => setState(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="city" 
                            className="form-control" 
                            placeholder="Digite sua Cidade" 
                            value={city} 
                            onChange={e => setCity(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading} block >Cadastrar</Button>
                    <div className="p-2 text-center">
                        {loading && (<span><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>)}
                    </div>
                </form>
            </div>
        </div>
    );
}