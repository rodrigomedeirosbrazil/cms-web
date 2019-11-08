import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from "react-router";

import Navbar from '../components/Navbar';
import CustomerForm from '../components/CustomerForm';

const CUSTOMER = gql`
    query ($id: String!) {
        customers (where: { id: { _eq: $id } }) { 
            id, name, email, address, city, state, zip
        }
    }
`;

const UPDATECUSTOMER = gql`
    mutation ($id: String!, $name: String!, $email: String, $address: String, $city: String, $state: String, $zip: String) {
        update_customers(where: {id: {_eq: $id}}, _set: {name: $name, email: $email, address: $address, city: $city, state: $state, zip: $zip}) {
            affected_rows
        }
    }
`;

export default function Customers ({ history }) {
    let { id } = useParams();
    const [values, setValues] = useState({});
    const [updated, setUpdated] = useState(false);

    const {data, error, loading} = 
        useQuery(
            CUSTOMER, 
            { 
                variables: { id }, 
                onCompleted: () => {
                    if (data && data.customers.length === 1) {
                        delete data.customers[0].__typename;
                        setValues({...data.customers[0]});
                    }
                }
            }
        );
    const [updateCustomer, { loading: loadingUpdate, error: errorUpdate }] = 
        useMutation(
            UPDATECUSTOMER, 
            { 
                variables: { ...values },
                onCompleted: () => {
                    setUpdated(true);
                }
            }
        );

    const onSubmit = (data) => {
        setValues(data);
        updateCustomer();
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-6 offset-md-3">
                    <h2>Cliente: </h2>
                    { updated && (
                    <div className="alert alert-success" role="alert">
                        Dados foram gravados com sucesso!
                    </div>
                    )}
                    {errorUpdate && (
                        <div className="alert alert-danger" role="alert">
                            Houve um erro durante a gravação: {errorUpdate.message}
                        </div>
                    )}
                    { loading ? (
                        <div className="spinner-border" role="status"></div>
                    ) : error ? (<h3>Houve um erro: {error.message}</h3>) : (
                    <div>
                        <CustomerForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loadingUpdate} />
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}