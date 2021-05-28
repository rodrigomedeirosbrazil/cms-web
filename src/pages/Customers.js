import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faTrash, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { LinkContainer as Link } from 'react-router-bootstrap'
import qs from 'query-string';

import graphql from '../services/graphql'

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const CUSTOMERS = `
    query ($limit: Int!, $offset: Int!) {
        customers_aggregate (where: {active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        customers (where: {active: {_eq: true}}, order_by: {name: asc, id: asc}, limit: $limit, offset: $offset) { 
            id, name, email 
        }
    }
`;

const CUSTOMERS_BY_NAME = `
    query ($search: String!, $limit: Int!, $offset: Int!) {
        customers_aggregate (where: {name: {_ilike: $search}, active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        customers (where: {name: {_ilike: $search}, active: {_eq: true}}, order_by: {name: asc, id: asc}, limit: $limit, offset: $offset) {
            id, name, email 
        }
    }
`;

const DELCUSTOMER = `
    mutation ($id: uuid!) {
        update_customers(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

let CUSTOMERS_GQL = CUSTOMERS;


export default function Customers ({ history }) {
    const [getPage, setPage] = useState(1);
    const limit = 15;
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    const handleFetch = async () => {
        let params = {};

        if (search === '') {
            CUSTOMERS_GQL = CUSTOMERS;
            params = { limit: limit, offset: (getPage - 1) * limit }
        }
        else {
            CUSTOMERS_GQL = CUSTOMERS_BY_NAME;
            params = { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit }
        }

        setLoading(true);

        const _data = await graphql(CUSTOMERS_GQL, params);
        setData(_data);

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

    const deleteCustomer = async () => {
        await graphql(DELCUSTOMER, { id: value });
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
        <Modal show={showModal} setShow={setShowModal} header="Confirmar" body="Deseja apagar o cliente?" onOk={deleteCustomer} value={value} showCancel={true}></Modal>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                        <h2>Clientes <Link to="/customer/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></Link></h2>
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
                            </div>
                        </div>
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