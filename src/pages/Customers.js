import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import Navbar from '../components/Navbar';

const CUSTOMERS = gql`
    query {
        customers (where: {active: {_eq: true}}, order_by: {name: asc}) { 
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
                <div className="col-md-10 offset-md-1">
                        <h2>Clientes <button href="/customer/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></button></h2>
                    { loading ? (
                        <div className="spinner-border" role="status"></div>
                    ) : error ? (<h3>Houve um erro: {error.message}</h3>) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                            { data && data.customers.map( 
                                customer => (
                                    <tr key={customer.id}>
                                        <td>{ customer.name }</td>
                                        <td>{ customer.email }</td>
                                        <td>
                                            <button href={'/customer/del/' + customer.id} className="btn btn-danger ml-1"><span><FontAwesomeIcon icon={faTrash} size="sm" /></span></button>
                                            <button href={'/customer/' + customer.id} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faUserEdit} size="sm" /></span></button>
                                        </td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}