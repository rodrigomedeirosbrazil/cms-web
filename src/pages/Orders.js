import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import { LinkContainer as Link } from 'react-router-bootstrap'
import qs from 'query-string';

import graphql from '../services/graphql'

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const ORDERS = `
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

const ORDERS_BY_DESCRIPTION = `
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

const ORDERS_BY_CUSTOMER = `
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

const DELORDER = `
    mutation ($id: uuid!) {
        update_orders(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Orders ({ history }) {
    const [getPage, setPage] = useState(1);
    const limit = 15;
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const handleFetch = async () => {
        let params = {};

        if (search === '') {
            ORDERS_GQL = ORDERS;
            params = { limit: limit, offset: (getPage - 1) * limit }
        }
        else if (searchType === 0) {
            ORDERS_GQL = ORDERS_BY_DESCRIPTION;
            params = { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit }
        }
        else if (searchType === 1) {
            ORDERS_GQL = ORDERS_BY_CUSTOMER;
            params = { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit }
        }

        setLoading(true);

        const _data = await graphql(ORDERS_GQL, params);

        if (_data.orders) {
            const orders = _data.orders.reduce((groups, item) => {
                const date = item.date_pickup;
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(item);
                return groups;
            }, [])

            const newData = { ..._data, orders }
            setData(newData);
        }

        setLoading(false);
    }

    useEffect(
        () => {
            handleFetch();
        },
        // eslint-disable-next-line
        [getPage, searchQuery]
    )


    useEffect(
        () => {
            const parsedQuery = qs.parse(history.location.search);
            if (parsedQuery.page) {
                setPage(parseInt(parsedQuery.page));
            } else {
                setPage(1);
            }
            handleFetch();
        },
        // eslint-disable-next-line
        [history]
    )

    const deleteOrder =  async () => {
        await graphql(DELORDER, { id: value });
        handleFetch();
    }

    const showModalDelete = (id) => {
        setValue(id);
        setShowModal(true);
    }

    const handleSearch = (event) => {
        setPage(1);
        const parsedQuery = qs.parse(history.location.search);
        const newQueryString = qs.stringify({ ...parsedQuery, search: '' });
        history.push(`${history.location.pathname}?${newQueryString}`);
        setSearchQuery(search);
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
                                        <th>Data devolução</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {data && data.orders ? Object.keys(data.orders).map(
                                    date => (
                                        <React.Fragment key={date}>
                                            <tr><th colSpan="5" className="table-primary"><Moment format="DD/MM/YYYY">{date}</Moment></th></tr>
                                            { data.orders[date].map(
                                                item => (
                                                    <tr key={item.id}>
                                                        <td>{item.customer.name}</td>
                                                        <td>{item.description}</td>
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
                                                        <td><Moment format="DD/MM/YYYY">{item.date_back}</Moment></td>
                                                        <td>
                                                            <Link to={'/order/' + item.id} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faEdit} size="sm" /></span></Link>
                                                            <button onClick={() => showModalDelete(item.id)} className="btn btn-danger ml-1"><span><FontAwesomeIcon icon={faTrash} size="sm" /></span></button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </React.Fragment>
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