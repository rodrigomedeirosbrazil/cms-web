import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { LinkContainer as Link } from 'react-router-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

import graphql from '../services/graphql'
import Navbar from '../components/Navbar';
import OrderForm from '../components/OrderForm';
import Modal from '../components/Modal';

const ORDER = `
    query ($id: uuid!) {
        orders (where: { id: { _eq: $id } }) { 
            id
            idn
            description, 
            total,
            discount,
            deposit,
            date_pickup, 
            date_back, 
            customer {
                id, name, doc, phone, address, neighborhood, city, state, zip
            }
            order_items {
                item {
                    id, idn, name, picture
                }
                value
                value_repo
                quantity
            }
        }
    }
`;

const UPDATE_ORDER = `
    mutation (
        $id: uuid!
        $idn: numeric!
        $description: String, 
        $total: numeric!, 
        $discount: numeric!,
        $deposit: numeric!,
        $date_pickup: date, 
        $date_back: date,
        $order_items: [order_item_insert_input!]!,
        $customer_id: uuid!,
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
                discount: $discount,
                deposit: $deposit,
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

const Order = ({history}) => {
    let { id } = useParams();
    const [values, setValues] = useState({});
    const [updated, setUpdated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [error, setError] = useState();
    const [errorUpdate, setErrorUpdate] = useState(false);

    useEffect(
        () => {
            const getOrder = async () => {
                setLoading(true);
                const _data = await graphql(ORDER, { id });
                setLoading(false);
                if (_data && _data.orders.length > 0) {
                    setValues({..._data.orders[0]});
                } else {
                    setError({ 'message': '' });
                }
            }
            getOrder();
        },
        [history, id]
    )
    

    const onSubmit = async (data) => {
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

        setLoadingUpdate(true);
        const retorno = await graphql(UPDATE_ORDER, _data);
        setLoadingUpdate(false);
        if (!retorno || !retorno.update_orders || retorno.update_orders.affected_rows === 0) {
            setErrorUpdate({ message: '' })
        } 
    }

    return (
        <>
        <Navbar></Navbar>
        <Modal
            show={updated}
            setShow={setUpdated}
            header="Sucesso"
            body="Dados foram gravados com sucesso!"
            showCancel={false}
            onClose={() => history.push('/orders')}
        />
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                    <h2>
                        Pedido: #{values?.idn} 
                        <Link 
                            to={{
                                pathname: '/order/new',
                                state: { 
                                    values: { 
                                        order_items: values.order_items
                                    }
                                }
                            }}
                            className="btn btn-primary btn-sm ml-2" 
                        >
                            <span><FontAwesomeIcon icon={faCopy} size="lg" /></span>
                        </Link>
                    </h2>
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

export default Order