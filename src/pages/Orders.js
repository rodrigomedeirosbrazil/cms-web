import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const ORDERS = gql`
    query {
        orders (where: {active: {_eq: true}}, order_by: {date_pickup: asc}) { 
            id, description, total, date_pickup, date_back
            customer {
                name
            } 
        }
    }
`;

const DELORDER = gql`
    mutation ($id: Int!) {
        update_orders(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Orders ({ history }) {
    const {data, error, loading} = useQuery(ORDERS);
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    
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
                        <h2>Pedidos <a href="/order/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></a></h2>
                    { loading ? (
                        <div className="spinner-border" role="status"></div>
                    ) : error ? (<h3>Houve um erro: {error.message}</h3>) : (
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
                                        <td>{ item.total }</td>
                                        <td>{ item.date_pickup }</td>
                                        <td>{ item.date_back }</td>
                                        <td>
                                            <a href={'/order/' + item.id} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faEdit} size="sm" /></span></a>
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
                    )}
                </div>
            </div>
        </div>
        </>
    );
}