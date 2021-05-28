import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import { LinkContainer as Link } from 'react-router-bootstrap'

const ORDERS = gql`
    query ($item_id: uuid!, $limit: Int!, $offset: Int!) {
        orders_aggregate (
            where: {
                active: {
                    _eq: true
                }, 
                order_items: {
                    item_id: {
                        _eq: $item_id
                    }
                }
            }
        ) {
            aggregate {
                totalCount: count
            }
        }
        orders (
            where: {
                active: {
                    _eq: true
                }, 
                order_items: {
                    item_id: {
                        _eq: $item_id
                    }
                }
            }, order_by: {date_pickup: desc, id: asc}, limit: $limit, offset: $offset) { 
            id, description, total, date_pickup, date_back
            customer {
                id, name
            }
        }
    }
`;

export default function ItemOrders ({ item_id }) {
    const [getPage] = useState(1);
    const limit = 15;
    const [getOrders, { data, loading }] = useLazyQuery(ORDERS);
    
    useEffect(
        () => {
            getOrders({ variables: { item_id, limit, offset: (getPage - 1) * limit } });
        },
        [item_id, getPage, getOrders]
    )

    return (
        <>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-10 offset-md-1">
                        <h2>Pedidos <Link to="/order/new" className="btn btn-primary btn-sm ml-1" ><span><FontAwesomeIcon icon={faPlusCircle} size="lg"/></span></Link></h2>
                    { loading ? (
                        <div className="spinner-border" role="status"></div>
                    ) : (
                    <>
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
                    </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}