import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';

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

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
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
                            <form onSubmit={handleSubmit}>
                                <CustomerForm values={values} handleChange={handleChange} />
                                <Button type="submit" disabled={loading} block >
                                    {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                                        : (<span><FontAwesomeIcon icon={faSave} size="lg" /></span>)}
                                    &nbsp;Salvar
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}