import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { LinkContainer as Link } from 'react-router-bootstrap'
import qs from 'query-string';
import NumberFormat from 'react-number-format';

import graphql from '../services/graphql'

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import noPhotoDataUri from '../assets/noPhotoDataUri'
import QrcodeReport from '../components/QrcodeReport.js'

const ITEMS = `
    query ($limit: Int!, $offset: Int!) {
        items_aggregate (where: {active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        items (where: {active: {_eq: true}}, order_by: {idn: asc}, limit: $limit, offset: $offset) {
            id, idn, name, description, quantity, value, picture
        }
    }
`;

const ITEMS_BY_NAME = `
    query ($search: String!, $limit: Int!, $offset: Int!) {
        items_aggregate (where: {name: {_ilike: $search}, active: {_eq: true}}) {
            aggregate {
                totalCount: count
            }
        }
        items (where: {name: {_ilike: $search}, active: {_eq: true}}, order_by: {idn: asc}, limit: $limit, offset: $offset) {
            id, idn, name, description, quantity, value, picture
        }
    }
`;

let ITEMS_GQL = ITEMS;

const DELITEM = `
    mutation ($id: uuid!) {
        update_items(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Items ({ history }) {
    const [getPage, setPage] = useState(1);
    const limit = 15;
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [selectedItems, setSelectItems] = useState([]);

    const handleFetch = async () => {
        let params = {};

        if (search === '') {
            ITEMS_GQL = ITEMS;
            params = { limit: limit, offset: (getPage - 1) * limit }
        }
        else {
            ITEMS_GQL = ITEMS_BY_NAME;
            params = { search: `%${search}%`, limit: limit, offset: (getPage - 1) * limit }
        }

        setLoading(true);

        const _data = await graphql(ITEMS_GQL, params);
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

    const deleteItem = async () => {
        await graphql(DELITEM, { id: value });
        setData({
            items_aggregate: data.items_aggregate,
            items: data.items.filter(item => item.id !== value)
        });
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

    const handleSelectItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectItems(selectedItems.filter(item => item !== itemId));
        } else {
            setSelectItems([...selectedItems, itemId]);
        }
    };

    return (
        <>
        <Navbar></Navbar>
        <Modal show={showModal} setShow={setShowModal} header="Confirmar" body="Deseja apagar o produto?" onOk={deleteItem} value={value} showCancel={true}></Modal>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                        <h2>Produtos <Link to="/item/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></Link></h2>
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
                                        placeholder="Digite o nome de um produto"
                                        name="search"
                                        value={search}
                                        onChange={ event => {
                                            setSearch(event.target.value);
                                        } }
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
                        <div>
                            <div className="float-left">
                                {data && data.items_aggregate && data.items_aggregate.aggregate && data.items_aggregate.aggregate.totalCount > 0 && (
                                    <Pagination totalCount={data.items_aggregate.aggregate.totalCount} page={getPage} changePage={setPage} limit={limit} history={history} />
                                )}
                            </div>

                            <div className="float-right">
                                <QrcodeReport search={search} />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th></th>
                                        <th>Foto</th>
                                        <th>Nome</th>
                                        <th>Descrição</th>
                                        <th>Quantidade</th>
                                        <th>Valor</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {data && data.items && data.items.length > 0 ? data.items.map(
                                    item => (
                                        <tr key={item.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={ () => handleSelectItem(item.id)}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    alt=""
                                                    src={item.picture}
                                                    className="img-thumbnail"
                                                    width="100"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = noPhotoDataUri }}
                                                />
                                            </td>
                                            <td>{item.name} #{item.idn}</td>
                                            <td>{ item.description }</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <NumberFormat
                                                    value={item.value}
                                                    displayType={'text'}
                                                    thousandSeparator={'.'}
                                                    decimalSeparator={','}
                                                    prefix={'R$'}
                                                    decimalScale={2}
                                                    fixedDecimalScale={true}
                                                    renderText={value => value}
                                                />
                                            </td>
                                            <td>
                                                <Link to={'/item/' + item.id} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faEdit} size="sm" /></span></Link>
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
                        {data && data.items_aggregate && data.items_aggregate.aggregate && data.items_aggregate.aggregate.totalCount > 0 && (
                            <Pagination totalCount={data.items_aggregate.aggregate.totalCount} page={getPage} changePage={setPage} limit={limit} history={history}/>
                        )}
                    </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}