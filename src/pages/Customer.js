import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useParams } from "react-router";
import { Button } from 'react-bootstrap';

import Navbar from '../components/Navbar';

const CUSTOMER = gql`
    query ($id: Int!) {
        customers (where: { id: { _eq: $id } }) { 
            id, name, email 
        }
    }
`;

const UPDATECUSTOMER = gql`
    mutation ($id: Int!, $name: String!, $email: String, $address: String, $city: String, $state: String, $zip: String) {
        update_customers(where: {id: {_eq: $id}}, _set: {name: $name, email: $email, address: $address, city: $city, state: $state, zip: $zip}) {
            affected_rows
        }
    }
`;

export default function Customers ({ history }) {
    let { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); //data.customers[0].email
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const {data, error, loading} = 
        useQuery(
            CUSTOMER, 
            { 
                variables: { id }, 
                onCompleted: () => {
                    if (data && data.customers.length === 1) {
                        setName(data.customers[0].name);
                        setEmail(data.customers[0].email);
                        setAddress(data.customers[0].address);
                        setCity(data.customers[0].city);
                        setState(data.customers[0].state);
                        setZip(data.customers[0].zip);
                    }
                }
            }
        );
    const [updateCustomer, { loadingUpdate }] = 
        useMutation(
            UPDATECUSTOMER, 
            { 
                variables: { 
                    id, name, email, address, city, state, zip
                } 
            }
        );

    async function handleSubmit(e) {
        e.preventDefault();
        updateCustomer({ variables: { id, name, email, address, city, state, zip } });
        //history.push('/main');
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                    <h2>Cliente: </h2>
                    { loading ? (
                        <span className="text-center"><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>
                    ) : error ? (<h3>Houve um erro: {error.message}</h3>) : (
                    <div>
                        <form onSubmit={handleSubmit}>
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
                            <Button type="submit" disabled={loadingUpdate} block >Salvar</Button>
                            <div className="p-2 text-center">
                                {loadingUpdate && (<span><FontAwesomeIcon icon={faSpinner} size="lg" spin /></span>)}
                            </div>
                        </form>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}