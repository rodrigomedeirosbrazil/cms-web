import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import { LinkContainer as Link } from 'react-router-bootstrap'
import qs from 'query-string';

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
        orders (where: {active: {_eq: true}}, order_by: {date_pickup: desc}, limit: $limit, offset: $offset) { 
            id, description, total, date_pickup, date_back
            customer {
                name
            } 
        }
    }
`;

const ORDERS_BY_DESCRIPTION = gql`
    query ($search: String!, $limit: Int!, $offset: Int!) {
        orders_aggregate (where: {description: {_ilike: $search}, active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        orders (where: {description: {_ilike: $search}, active: {_eq: true}}, order_by: {date_pickup: desc}, limit: $limit, offset: $offset) {
            id, description, total, date_pickup, date_back
            customer {
                name
            } 
        }
    }
`;

const ORDERS_BY_CUSTOMER = gql`
    query ($search: String!, $limit: Int!, $offset: Int!) {
        orders_aggregate (where: {customer: {name: {_ilike: $search}}, active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        orders (where: {customer: {name: {_ilike: $search}}, active: {_eq: true}}, order_by: {date_pickup: desc}, limit: $limit, offset: $offset) {
            id, description, total, date_pickup, date_back
            customer {
                name
            } 
        }
    }
`;

let ORDERS_GQL = ORDERS;

const DELORDER = gql`
    mutation ($id: uuid!) {
        update_orders(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Orders ({ history }) {
    const [getPage, setPage] = useState(1);
    const limit = 15;
    const [getOrders, { data, loading }] = useLazyQuery(ORDERS_GQL, {
        fetchPolicy: "network-only"
    });
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState(0);

    useEffect(
        () => {
            getOrders({ variables: { limit: limit, offset: (getPage - 1) * limit } });
        },
        [getPage, getOrders]
    )

    useEffect(
        () => {
            if (search === '') {
                ORDERS_GQL = ORDERS;
                getOrders({ variables: { limit: limit, offset: (getPage - 1) * limit } });
            }
            else if (searchType === 0) {
                ORDERS_GQL = ORDERS_BY_DESCRIPTION;
                getOrders({ variables: { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit } });
            }
            else if (searchType === 1) {
                ORDERS_GQL = ORDERS_BY_CUSTOMER;
                getOrders({ variables: { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit } });
            }

        },
        // eslint-disable-next-line
        [getPage, getOrders]
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

    const handleSearch = (event) => {
        setPage(1);
        if (search === '') {
            ORDERS_GQL = ORDERS;
            getOrders({ variables: { limit: limit, offset: (getPage - 1) * limit } });
        }
        else if (searchType === 0) {
            ORDERS_GQL = ORDERS_BY_DESCRIPTION;
            getOrders({ variables: { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit } });
        }
        else if (searchType === 1) {
            ORDERS_GQL = ORDERS_BY_CUSTOMER;
            getOrders({ variables: { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit } });
        }
        const parsedQuery = qs.parse(history.location.search);
        const newQueryString = qs.stringify({ ...parsedQuery, search: '' });
        history.push(`${history.location.pathname}?${newQueryString}`);
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
                        <div className="row">
                            <div className="col-md-8 offset-md-2">
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className='form-control'
                                        placeholder="Digite a busca"
                                        name="search"
                                        value={search}
                                        onChange={event => {
                                            setSearch(event.target.value);
                                        }}
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                    />
                                    <div className="input-group-append">
                                        <button onClick={handleSearch} disabled={loading} type="button" className="btn btn-primary">
                                            {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                                                : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                                        </button>
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col" onClick={() => setSearchType(0)}>
                                        <span className="mr-2"><FontAwesomeIcon icon={searchType === 0 ? faCheckCircle : faCircle} size="lg" /></span>Por descrição
                                    </div>
                                    <div className="col" onClick={() => setSearchType(1)}>
                                        <span className="mr-2"><FontAwesomeIcon icon={searchType === 1 ? faCheckCircle : faCircle} size="lg" /></span>Por cliente
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.orders_aggregate && data.orders_aggregate.aggregate && data.orders_aggregate.aggregate.totalCount > 0 && (
                            <Pagination totalCount={data.orders_aggregate.aggregate.totalCount} page={getPage} changePage={setPage} limit={limit} history={history} />
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
                                        <Pagination totalCount={data.orders_aggregate.aggregate.totalCount} page={getPage} changePage={setPage} limit={limit} history={history} />
                        )}
                    </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}