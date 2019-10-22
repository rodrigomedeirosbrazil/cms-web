import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Navbar from '../components/Navbar';

const CUSTOMERS = gql`
    query {
        customers { 
            id, name, email 
        }
    }
`;

export default function Customers ({ history }) {
    const {data, error, loading} = useQuery(CUSTOMERS);
    
    return (
        <>
        <Navbar></Navbar>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-4">
                    <h1>Clientes</h1>
                    { loading ? (
                        <h2 className="text-center">Carregando...</h2>
                    ) : error ? (<h3>Houve um erro: {error.message}</h3>) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        { data && data.customers.map( 
                            customer => (
                                <tr key={customer.id}>
                                    <td>{ customer.name }</td>
                                    <td>{ customer.email }</td>
                                    <td></td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}