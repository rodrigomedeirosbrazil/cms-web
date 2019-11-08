import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from "react-router";

import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';

const ORDER = gql`
    query ($id: String!) {
        orders (where: { id: { _eq: $id } }) { 
            description, 
            total, 
            date_pickup, 
            date_back, 
            customer {
                id, name
            }
            order_items {
                item {
                    id, name
                }
                value
                value_repo
                quantity
            }
        }
    }
`;

const UPDATE_ORDER = gql`
    mutation (
        $id: String!
        $description: String, 
        $total: numeric!, 
        $date_pickup: date, 
        $date_back: date,
        $order_items: [order_item_insert_input!]!,
        $customer_id: String!,
    ) {
        delete_order_item(
            where: {
                order_id: {
                    _eq: $id
                }
            }
        )
        {
            affected_rows
        }

        insert_order_item(
            objects: 
              $order_items
            
        ) {
          returning { item_id }
        }

        update_orders(
            where: {
                id: {
                    _eq: $id
                }
            }, 
            _set: {
                description: $description, 
                total: $total, 
                date_pickup: $date_pickup, 
                date_back: $date_back, 
                customer_id: $customer_id,
            }
        )
        {
            affected_rows
        }
    }
`;

export default function Orders ({ history }) {
    let { id } = useParams();
    const [values, setValues] = useState({});
    const [updated, setUpdated] = useState(false);

    const {data, error, loading} = 
        useQuery(
            ORDER, 
            { 
                variables: { id }, 
                onCompleted: () => {
                    if (data && data.orders.length === 1) {
                        delete data.orders[0].__typename;
                        setValues({...data.orders[0]});
                    }
                }
            }
        );
        
    const [updateOrder, { loading: loadingUpdate, error: errorUpdate }] = 
        useMutation(
            UPDATE_ORDER, 
            { 
                onCompleted: () => {
                    setUpdated(true);
                }
            }
        );

    const onSubmit = (data) => {
        let _data = { ...data };
        delete _data.__typename;
        delete _data.customer;
        _data.customer_id = data.customer.id;
        _data.id = id;
        _data.order_items = data.order_items.map(
            item => {
                return {
                    item_id: item.item.id,
                    value: item.value,
                    value_repo: item.value_repo,
                    quantity: item.quantity,
                    order_id: id
                }
            }
        );

        updateOrder({ variables: _data }); 
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-6 offset-md-3">
                    <h2>Produto: </h2>
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
                        <OrderForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loadingUpdate} />
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}