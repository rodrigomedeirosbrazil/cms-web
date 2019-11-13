import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { LinkContainer as Link } from 'react-router-bootstrap'
import NumberFormat from 'react-number-format';

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const ITEMS = gql`
    query {
        items (where: {active: {_eq: true}}, order_by: {idn: asc}) { 
            id, idn, name, description, quantity, value, picture 
        }
    }
`;

const DELITEM = gql`
    mutation ($id: uuid!) {
        update_items(where: {id: {_eq: $id}}, _set: {active: false}) {
            affected_rows
        }
    }
`;

export default function Items ({ history }) {
    const {data, error, loading} = useQuery(ITEMS);
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState(false);
    
    const [delItem] =
        useMutation(
            DELITEM,
            {
                onCompleted: () => {
                    history.go(0);
                }
            }
        );

    const deleteItem = () => {
        delItem({ variables: { id: value } });
    }

    const showModalDelete = (id) => {
        setValue(id);
        setShowModal(true);
    }

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
                    ) : error ? (<h3>Houve um erro: {error.message}</h3>) : (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
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
                                        {item.picture ? (
                                        <td>
                                            <img alt="" src={item.picture} className="img-thumbnail" width="100" />
                                        </td>
                                        ): (<td>SEM FOTO</td>)}
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
                                <td colSpan="5" className="text-center"><h1>VAZIO</h1></td>
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