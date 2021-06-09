import React, { useState } from 'react';
import graphql from '../services/graphql'
import uuid from 'uuid/v4';

import Navbar from '../components/Navbar';
import ItemForm from '../components/ItemForm';
import Modal from '../components/Modal';

import { getAuth } from '../services/auth';

const ITEM = `
    query ($user_id: uuid!) {
        items (order_by: {idn: desc}, limit: 1, where: { user_id: { _eq: $user_id }, active: {_eq: true} }) { 
            idn
        }
    }
`;

const NEWITEM = `
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
        insert_items(
            objects: {
                id: $id, 
                idn: $idn, 
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
    const [values, setValues] = useState({quantity: 1});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);
    const [error, setError] = useState();

    const onSubmit = async data => {
        setLoading(true);

        setLoadingItem(true);
        const auth = getAuth();
        const lastIds = await graphql(ITEM, { user_id: `${auth.user.id}` });
        setLoadingItem(false);

        const idn = lastIds.items.length > 0 ? lastIds.items[0].idn + 1 : 1;
        const _data = { ...values, id: uuid(), idn };

        try {
            await graphql(NEWITEM, { ..._data });
            setShowModal(true);
            setValues({});
        } catch(e) {
            setError({
                message: e.message
            })
        }

        setLoading(false);
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
                            <ItemForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loading || loadingItem} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}