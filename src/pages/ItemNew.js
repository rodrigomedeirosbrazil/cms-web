import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Navbar from '../components/Navbar';
import ItemForm from '../components/ItemForm';
import Modal from '../components/Modal';

const NEWITEM = gql`
    mutation (
        $name: String!, 
        $description: String, 
        $value: money, 
        $value_repo: money, 
        $quantity: Int, 
        $width: Int,  
        $height: Int,  
        $length: Int, 
        $picture: String
    ) {
        insert_items(
            objects: {
                name: $name, 
                description: $description, 
                value: $value, 
                value_repo: $value_repo, 
                quantity: $quantity,
                width: $width,
                height: $height,
                length: $length,
                picture: $picture
            }
        ) {
          returning { id }
        }
    }
`;

export default function ItemNew({ history }) {
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [newItem, { loading, error }] = 
        useMutation(
            NEWITEM, 
            { 
                variables: { ...values },
                onCompleted: () => {
                    setShowModal(true);
                    setValues({});
                }
            }
        );

    const onSubmit = (data) => {
        setValues(data);
        newItem();
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
                onClose={ () => history.push('/items') } 
            />
            
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-6 offset-md-3">
                        <h2>Novo Produto: </h2>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                Houve um erro: {error.message}
                            </div>
                        )}
                        <div>
                            <ItemForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}