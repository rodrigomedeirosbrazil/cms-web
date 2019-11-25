import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { LinkContainer as Link } from 'react-router-bootstrap'
import qs from 'query-string';

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const CUSTOMERS = gql`
    query ($limit: Int!, $offset: Int!) {
        customers_aggregate (where: {active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        customers (where: {active: {_eq: true}}, order_by: {name: asc}, limit: $limit, offset: $offset) { 
            id, name, email 
        }
    }
`;

const DELCUSTOMER = gql`
    mutation ($id: uuid!) {
        update_customers(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Customers ({ history }) {
    const [getPage, setPage] = useState(1);
    const limit = 15;
    const [getCustomers, { data, loading }] = useLazyQuery(CUSTOMERS);
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    
    useEffect(
        () => {
            getCustomers({ variables: { limit: limit, offset: (getPage - 1) * limit } });
        },
        [getPage, getCustomers]
    )

    useEffect(
        () => {
            const parsedQuery = qs.parse(history.location.search);
            if (parsedQuery.page) {
                setPage(parseInt(parsedQuery.page));
            } else {
                setPage(1);
            }
        },
        [history]
    )

    const [delCustomer] =
        useMutation(
            DELCUSTOMER,
            {
                onCompleted: () => {
                    history.go(0);
                }
            }
        );

    const deleteCustomer = () => {
        delCustomer({ variables: { id: value } });
    }

    const showModalDelete = (id) => {
        setValue(id);
        setShowModal(true);
    }

    return (
        <>
        <Navbar></Navbar>
        <Modal show={showModal} setShow={setShowModal} header="Confirmar" body="Deseja apagar o cliente?" onOk={deleteCustomer} value={value} showCancel={true}></Modal>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                        <h2>Clientes <Link to="/customer/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></Link></h2>
                    { loading ? (
                        <div className="spinner-border" role="status"></div>
                    ) : (
                    <>
                        {data && data.customers_aggregate && data.customers_aggregate.aggregate && data.customers_aggregate.aggregate.totalCount > 0 && (
                            <Pagination totalCount={data.customers_aggregate.aggregate.totalCount} page={getPage} changePage={setPage} limit={limit} history={history} />
                        )}
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { data && data.customers && data.customers.length >0 ? data.customers.map( 
                                    customer => (
                                        <tr key={customer.id}>
                                            <td>{ customer.name }</td>
                                            <td>{ customer.email }</td>
                                            <td>
                                                <Link to={'/customer/' + customer.id} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faUserEdit} size="sm" /></span></Link>
                                                <button onClick={ () => showModalDelete(customer.id)} className="btn btn-danger ml-1"><span><FontAwesomeIcon icon={faTrash} size="sm" /></span></button>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center"><h1>VAZIO</h1></td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        {data && data.customers_aggregate && data.customers_aggregate.aggregate && data.customers_aggregate.aggregate.totalCount > 0 && (
                            <Pagination totalCount={data.customers_aggregate.aggregate.totalCount} page={getPage} changePage={setPage} limit={limit} history={history} />
                        )}
                    </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}