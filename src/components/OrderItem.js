import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import MoneyInput from '../components/MoneyInput';

const OrderItem = ({ item, deleteItem, changeItem }) => {

    return (
        <tr>
            <td>{item.name}</td>
            <td>NA</td>
            <td>
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
            </td>
            <td>
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
            </td>
            <td>
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
            </td>
            <td>
                <button
                    onClick={() => deleteItem(item)}
                    className="btn btn-danger ml-1"
                >
                    <span><FontAwesomeIcon icon={faTrash} size="sm" /></span>
                </button>
            </td>
        </tr>
    )  
}

export default OrderItem;