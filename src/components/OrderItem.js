import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import MoneyInput from '../components/MoneyInput';

const OrderItem = ({ item, deleteItem, changeItem }) => {

    return (
        <div className="card mb-3">
            <div
                className={
                    item.stock !== undefined && item.stock < 1
                        ? 'card-header text-white bg-danger'
                        : 'card-header text-white bg-secondary'
                }
            >
                {item.item.name} #{item.item.idn}
                <button
                    type="button"
                    onClick={
                        (e) => {
                            e.preventDefault();
                            deleteItem(item)
                        }
                    }
                    className="btn btn-light ml-1 float-right"
                >
                    <span><FontAwesomeIcon icon={faTrash} size="sm" /></span>
                </button>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        <img alt={item.item.id} src={item.item.picture} className="img-thumbnail" width="100" />
                    </div>
                    <div className="col-8">
                        <div className="row">
                            <div className="col text-right">
                                <label>Quant.:</label>
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    onChange={
                                        event => {
                                            event.preventDefault();
                                            item.quantity = event.target.value;
                                            changeItem(item);
                                        }
                                    }
                                    min="1"
                                    value={item.quantity}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-right">
                                <label>Valor:</label>
                            </div>
                            <div className="col">
                                <MoneyInput
                                    className="form-control"
                                    value={item.value || "0.00"}
                                    onChange={
                                        event => {
                                            item.value = event.target.value;
                                            changeItem(item);
                                        }
                                    }
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col text-right">
                                <label>Reposição:</label>
                            </div>
                            <div className="col">
                                <MoneyInput
                                    className="form-control"
                                    value={item.value_repo || "0.00"}
                                    onChange={
                                        event => {
                                            item.value_repo = event.target.value;
                                            changeItem(item);
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )  
}

export default OrderItem;