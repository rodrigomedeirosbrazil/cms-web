import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Navbar from '../components/Navbar';
import CustomerForm from '../components/CustomerForm';

const NEWCUSTOMER = gql`
    mutation ($name: String!, $email: String, $address: String, $city: String, $state: String, $zip: String) {
        insert_customers(objects: {name: $name, email: $email, address: $address, city: $city, state: $state, zip: $zip}) {
          returning { id }
        }
    }
`;

export default function CustomerRegister({ history }) {
    const [values, setValues] = useState({});
    const [updated, setUpdated] = useState(false);

    const [newCustomer, { loading, error }] = 
        useMutation(
            NEWCUSTOMER, 
            { 
                variables: { ...values },
                onCompleted: () => {
                    setUpdated(true);
                    setValues({});
                }
            }
        );

    const onSubmit = (data) => {
        setValues(data);
        newCustomer();
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-6 offset-md-3">
                        <h2>Novo Cliente: </h2>
                        {updated && (
                            <div className="alert alert-success" role="alert">
                                Dados foram gravados com sucesso!
                            </div>
                        )}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                Houve um erro: {error.message}
                            </div>
                        )}
                        <div>
                            <CustomerForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}