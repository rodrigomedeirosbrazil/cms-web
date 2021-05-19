import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import uuid from 'uuid/v4';

import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';
import Modal from '../components/Modal';
import { getAuth } from '../services/auth';
import graphql from '../services/graphql'

const NEWORDER = gql`
    mutation (
        $id: uuid!, 
        $idn: Int!, 
        $description: String, 
        $total: numeric!, 
        $discount: numeric!,
        $deposit: numeric!,
        $date_pickup: date, 
        $date_back: date,
        $order_items: [order_item_insert_input!]!,
        $customer_id: uuid!,
    ) {
        insert_orders(
            objects: {
                id: $id, 
                idn: $idn, 
                description: $description, 
                total: $total, 
                discount: $discount,
                deposit: $deposit,
                date_pickup: $date_pickup,
                date_back: $date_back,
                order_items: {
                    data: $order_items
                },
                customer_id: $customer_id,
            }
        ) {
          returning { id }
        }
    }
`;

export default function OrderNew({ history, location }) {
    const [values, setValues] = useState({ discount: 0, deposit: 0, total: 0 });
    const [showModal, setShowModal] = useState(false);
    const [id, setId] = useState();

    useEffect(
        () => {
            if (location && location.state && location.state.values) {
                setValues({ ...location.state.values, discount: 0, deposit: 0 });
            }
        },
        // eslint-disable-next-line
        [history]
    )

    const [newOrder, { loading, error }] = 
        useMutation(
            NEWORDER, 
            { 
                onCompleted: (data) => {
                    setId(data.insert_orders.returning[0].id);
                    setShowModal(true);
                    setValues({});
                }
            }
        );

    const getLastIdn = async () => {
        const ORDERS = `
            query ($user_id: uuid!) {
                orders (order_by: {idn: desc}, limit: 1, where: { customer: {user_id: {_eq: $user_id}}, active: {_eq: true}, idn: {_is_null: false} }) { 
                    idn
                }
            }
        `;

        const auth = getAuth();
        const _data = await graphql(
            ORDERS,
            {
                user_id: auth.user.id
            }
        );
        return _data.orders && _data.orders.length === 1 ? _data.orders[0].idn + 1 : 1
    }

    const onSubmit = async (data) => {
        let _data = { ...data };
        _data.id = uuid();
        _data.idn = await getLastIdn();
        delete _data.__typename;
        delete _data.customer;
        _data.customer_id = data.customer.id;
        _data.order_items = data.order_items.map(
            item => {
                return {
                    item_id: item.item.id,
                    value: item.value,
                    value_repo: item.value_repo,
                    quantity: item.quantity,
                }
            }
        );

        newOrder({ variables: _data }); 
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
                onClose={ () => history.push(`/order/${id}`) } 
            />
            
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-10 offset-md-1">
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