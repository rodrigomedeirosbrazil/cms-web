import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from "react-router";

import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';

const ITEM = gql`
    query ($id: Int!) {
        orders (where: { id: { _eq: $id } }) { 
            description, 
            date_pickup, 
            date_back, 
        }
    }
`;

const UPDATEITEM = gql`
    mutation (
        $id: Int!
        $name: String!, 
        $description: String, 
        $value: numeric, 
        $value_repo: numeric, 
        $quantity: Int, 
        $width: Int,  
        $height: Int,  
        $length: Int, 
        $picture: String
    ) {
        update_orders(
            where: {
                id: {
                    _eq: $id
                }
            }, 
            _set: {
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
            ITEM, 
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
            UPDATEITEM, 
            { 
                variables: { ...values, id },
                onCompleted: () => {
                    setUpdated(true);
                }
            }
        );

    const onSubmit = (data) => {
        setValues(data);
        updateOrder();
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