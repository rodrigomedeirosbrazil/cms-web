import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';

import CustomerPicker from '../components/CustomerPicker';
import ItemPicker from '../components/ItemPicker';
import OrderItem from '../components/OrderItem';


const OrderForm = ({values, setValues, onSubmit, loading}) => {
    const [errors, setErrors] = useState();

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let _errors;

        if (! values.customer) {
            _errors = { customer: 'É obrigatório escolher o cliente' };
        }

        if (! values.order_items || values.order_items.length < 1) {
            _errors = { ..._errors, order_items: 'É obrigatório colocar pelo menos 1 produto' };
        }

        setErrors(_errors);
        if (_errors) return;

        onSubmit({ ...values, total: total() });
    };

    const addItem = ({ id, name, value, value_repo }) => {
        // TODO: verificar os dados antes!
        const item = { item: {id, name}, value, value_repo, quantity: 1 }
        let order_items;
        if (!values.order_items) {
            order_items = [item];
        } else {
            order_items = values.order_items.filter(
                _item => { 
                    return _item.item.id === item.item.id
                }
            );
            if (order_items.length !== 1) {
                order_items = [...values.order_items, item];
            } else {
                order_items = [...values.order_items];
            }
        }
        setValues({ ...values, order_items });
    };

    const deleteItem = item => {
        const order_items = values.order_items.filter(
            (_item) => {
                if (_item.item.id !== item.item.id) return true;
                return false;
            }
        );
        setValues({...values, order_items});
    };

    const changeItem = item => {
        const order_items = values.order_items.map( item => {return item});
        setValues({ ...values, order_items});
    };

    const total = () => {
        const _total = values.order_items
            ? values.order_items.reduce((sum, i) => (
                sum += i.quantity * i.value
            ), 0)
            : 0
        return _total;
    }

    return (
        <form onSubmit={handleSubmit}>
            { values.id && (
                <input type="hidden" name="id" defaultValue={values.id || ''}/>
            )}
            <div className="form-group">
                <label>Tema</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o tema ou descrição"
                    onChange={handleChange}
                    defaultValue={values.description || ''}
                    name="description"
                />
            </div>
            <div className="card mb-3">
                <div className="card-header">
                    Cliente
                </div>
                <div className="card-body">
                    {!values.customer ? (
                    <CustomerPicker 
                        onChange={ (id, name) => setValues({ ...values, customer: { id, name } })}
                        error={errors && errors.customer}
                    />
                    ) : ( 
                    <div className="row">
                        <div className="col-12">
                            {values.customer.name}
                            <button
                                onClick={() => setValues({ ...values, customer: undefined })}
                                className="btn btn-danger ml-1"
                            >
                                <span><FontAwesomeIcon icon={faTrash} size="sm" /></span>
                            </button>
                        </div>
                    </div>
                    )}
                    
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header">
                    Datas
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label>Data de retirada</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={handleChange}
                                    defaultValue={values.date_pickup || ''}
                                    name="date_pickup"
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label>Data de devolução</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={handleChange}
                                    defaultValue={values.date_back || ''}
                                    name="date_back"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            Dias: 
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header">
                    Produtos
                </div>
                <div className="card-body">
                    <ItemPicker
                        onChange={addItem}
                        error={errors && errors.order_items}
                    />
                    {values.order_items && values.order_items.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Produto</th>
                                    <th>Qnt. disponível</th>
                                    <th>Qnt.</th>
                                    <th>Valor</th>
                                    <th>Reposição</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {values.order_items.map(
                                    item => (
                                        <OrderItem key={item.item.id} item={item} deleteItem={deleteItem} changeItem={changeItem}/>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    ):(
                        <span className="text-center">Nenhum produto adicionado</span>
                    )}
                </div>
                <div className="card-footer text-muted">
                    Total:
                    <NumberFormat
                        value={total()}
                        displayType={'text'}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={'R$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={value => value}
                    /><br />
                    Peças: {values && values.order_items ? values.order_items.length: '0'}
                </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                    : (<span><FontAwesomeIcon icon={faSave} size="lg" /></span>)}
                &nbsp;Salvar
            </button>
        </form>
    )  
}

export default OrderForm;