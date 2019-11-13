import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import uuid from 'uuid/v4';

import Navbar from '../components/Navbar';
import CustomerForm from '../components/CustomerForm';
import Modal from '../components/Modal';

const NEWCUSTOMER = gql`
    mutation ($id: uuid!, $name: String!, $email: String, $address: String, $city: String, $state: String, $zip: String) {
        insert_customers(objects: {id: $id, name: $name, email: $email, address: $address, city: $city, state: $state, zip: $zip}) {
          returning { id }
        }
    }
`;

export default function CustomerNew({ history }) {
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [newCustomer, { loading, error }] = 
        useMutation(
            NEWCUSTOMER, 
            { 
                onCompleted: () => {
                    setShowModal(true);
                    setValues({});
                }
            }
        );

    const onSubmit = (data) => {
        data.id = uuid();
        setValues(data);
        newCustomer({ variables: data }); 
    }

    return (
        <>
            <Navbar />
            <Modal 
                show={showModal} 
                setShow={setShowModal} 
                header="Sucesso" 
                body="Dados foram gravados com sucesso!" 
                showCancel={false} 
                onClose={ () => history.push('/customers') } 
            />
            
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-6 offset-md-3">
                        <h2>Novo Cliente: </h2>
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