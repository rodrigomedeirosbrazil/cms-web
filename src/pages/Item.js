import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from "react-router";

import Navbar from '../components/Navbar';
import ItemForm from '../components/ItemForm';

const ITEM = gql`
    query ($id: uuid!) {
        items (where: { id: { _eq: $id } }) { 
            name, 
            description, 
            value, 
            value_repo, 
            quantity,
            width,
            height,
            length,
            picture,
            idn
        }
    }
`;

const UPDATEITEM = gql`
    mutation (
        $id: uuid!,
        $idn: Int!,
        $name: String!, 
        $description: String, 
        $value: numeric, 
        $value_repo: numeric, 
        $quantity: Int, 
        $width: numeric,  
        $height: numeric,  
        $length: numeric, 
        $picture: String
    ) {
        update_items(
            where: {
                id: {
                    _eq: $id
                }
            }, 
            _set: {
                name: $name, 
                idn: $idn, 
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

export default function Items ({ history }) {
    let { id } = useParams();
    const [values, setValues] = useState({});
    const [updated, setUpdated] = useState(false);

    const {data, error, loading} = 
        useQuery(
            ITEM, 
            { 
                variables: { id }, 
                onCompleted: () => {
                    if (data && data.items.length === 1) {
                        delete data.items[0].__typename;
                        setValues({...data.items[0]});
                    }
                }
            }
        );
    const [updateItem, { loading: loadingUpdate, error: errorUpdate }] = 
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
        updateItem();
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-6 offset-md-3">
                    <h2>Produto: #{values.idn}</h2>
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
                        <ItemForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loadingUpdate} />
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}