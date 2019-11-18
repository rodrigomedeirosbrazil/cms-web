import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import { LinkContainer as Link } from 'react-router-bootstrap'

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const ORDERS = gql`
    query ($limit: Int!, $offset: Int!) {
        orders_aggregate (where: {active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        orders (where: {active: {_eq: true}}, order_by: {date_pickup: asc}, limit: $limit, offset: $offset) { 
            id, description, total, date_pickup, date_back
            customer {
                name
            } 
        }
    }
`;

const DELORDER = gql`
    mutation ($id: uuid!) {
        update_orders(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Orders ({ history }) {
    const { page } = useParams();
    const [getPage, setPage] = useState(1);
    const limit = 15;
    const [getOrders, { data, loading }] = useLazyQuery(ORDERS);
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    
    useEffect(
        () => {
            getOrders({ variables: { limit: limit, offset: (getPage - 1) * limit } });
        },
        [getPage, getOrders]
    )

    useEffect(
        () => {
            const _page = page ? parseInt(page) : 1;
            setPage(_page);
        },
        [page]
    )

    const [delOrder] =
        useMutation(
            DELORDER,
            {
                onCompleted: () => {
                    history.go(0);
                }
            }
        );

    const deleteOrder = () => {
        delOrder({ variables: { id: value } });
    }

    const showModalDelete = (id) => {
        setValue(id);
        setShowModal(true);
    }

    return (
        <>
        <Navbar></Navbar>
        <Modal show={showModal} setShow={setShowModal} header="Confirmar" body="Deseja apagar o pedido?" onOk={deleteOrder} value={value} showCancel={true}></Modal>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                        <h2>Pedidos <Link to="/order/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></Link></h2>
                    { loading ? (
                        <div className="spinner-border" role="status"></div>
                    ) : (
                    <>
                        {data && data.orders_aggregate && data.orders_aggregate.aggregate && data.orders_aggregate.aggregate.totalCount > 0 && (
                            <Pagination totalCount={data.orders_aggregate.aggregate.totalCount} page={getPage} limit={limit} history={history} />
                        )}
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Descrição</th>
                                        <th>Total</th>
                                        <th>Data retirada</th>
                                        <th>Data devolução</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {data && data.orders && data.orders.length > 0 ? data.orders.map( 
                                    item => (
                                        <tr key={item.id}>
                                            <td>{ item.customer.name }</td>
                                            <td>{ item.description }</td>
                                            <td>
                                                <NumberFormat
                                                    value={item.total}
                                                    displayType={'text'}
                                                    thousandSeparator={'.'}
                                                    decimalSeparator={','}
                                                    prefix={'R$'}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    renderText={value => value}
                                                />
                                            </td>
                                            <td><Moment format="DD/MM/YYYY">{item.date_pickup}</Moment></td>
                                            <td><Moment format="DD/MM/YYYY">{item.date_back}</Moment></td>
                                            <td>
                                                <Link to={'/order/' + item.id} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faEdit} size="sm" /></span></Link>
                                                <button onClick={ () => showModalDelete(item.id)} className="btn btn-danger ml-1"><span><FontAwesomeIcon icon={faTrash} size="sm" /></span></button>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                <tr>
                                    <td colSpan="6" className="text-center"><h1>VAZIO</h1></td>
                                </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        {data && data.orders_aggregate && data.orders_aggregate.aggregate && data.orders_aggregate.aggregate.totalCount > 0 && (
                            <Pagination totalCount={data.orders_aggregate.aggregate.totalCount} page={getPage} limit={limit} history={history} />
                        )}
                    </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}