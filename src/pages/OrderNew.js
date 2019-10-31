import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';
import Modal from '../components/Modal';

const NEWORDER = gql`
    mutation (
        $description: String, 
        $value: numeric!, 
        $date_pickup: date, 
        $date_back: date,
        $items: [order_item_insert_input!]!,
        $customer_id: Int!,
    ) {
        insert_orders(
            objects: {
                description: $description, 
                value: $value, 
                date_pickup: $date_pickup,
                date_back: $date_back,
                order_items: {
                    data: $items
                },
                customer_id: $customer_id,
            }
        ) {
          returning { id }
        }
    }
`;

export default function OrderNew({ history }) {
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false);

    const [newOrder, { loading, error }] = 
        useMutation(
            NEWORDER, 
            { 
                onCompleted: () => {
                    setShowModal(true);
                    setValues({});
                }
            }
        );

    const onSubmit = (data) => {
        console.log(data);
        setValues(data);
        newOrder();
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
                onClose={ () => history.push('/orders') } 
            />
            
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-6 offset-md-3">
                        <h2>Novo Pedido:</h2>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                Houve um erro: {error.message}
                            </div>
                        )}
                        <div>
                            <OrderForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}