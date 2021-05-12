import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash, faClipboard, faReceipt } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import 'moment/locale/pt-br'; 

import CustomerPicker from '../components/CustomerPicker';
import ItemPicker from '../components/ItemPicker';
import OrderItem from '../components/OrderItem';
import MoneyInput from '../components/MoneyInput';
import Receipt from '../components/Receipt';

const normalizeToCurrency = number => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number)
}

const OrderForm = ({values, setValues, onSubmit, loading}) => {
    const [errors, setErrors] = useState();
    const [orderText, setOrderText] = useState('');
    const [loadingReceipt, setLoadingReceipt] = useState(false);

    useEffect(
        () => {
            setOrderText(createOrderText(values));
        },
        [values]
    )

    const receiptGenerate = async () => {
        setLoadingReceipt(true);
        await Receipt(values);
        setLoadingReceipt(false);
    }

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

        onSubmit({ ...values, total: total(values) });
    };

    const addItem = ({ id, idn, name, value, value_repo, picture }) => {
        // TODO: verificar os dados antes!
        const item = { item: {id, idn, name, picture}, value, value_repo, quantity: 1 }
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
                            <a href={'/customer/'+ values.customer.id}>{values.customer.name}</a>
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
                    {values.date_pickup && values.date_back && (
                    <div className="row">
                        <div className="col-12">
                                Dias: {moment(values.date_back).diff(moment(values.date_pickup), 'days') }
                        </div>
                    </div>
                    )}
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
                        values={values}
                    />
                    {values.order_items && values.order_items.length > 0 ? (
                        <>
                        {values.order_items.map(
                            (item, index) => (
                                <OrderItem key={item.item.id+index} item={item} deleteItem={deleteItem} changeItem={changeItem} />
                            )
                        )}
                        </>
                    ) : (
                        <span className="text-center">Nenhum produto adicionado</span>
                    )}
                </div>
                <div className="card-footer text-muted">
                    <div className="form-group">
                        <label>Desconto</label>
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">R$</div>
                            </div>
                            <MoneyInput
                                className="form-control"
                                name="discount"
                                value={values.discount || "0.00"}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Sinal</label>
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">R$</div>
                            </div>
                            <MoneyInput
                                className="form-control"
                                name="deposit"
                                value={values.deposit || "0.00"}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    Total:&nbsp;
                    <NumberFormat
                        value={total(values)}
                        displayType={'text'}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={'R$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={value => value}
                    />
                    &nbsp; - Total a pagar:&nbsp;
                    <NumberFormat
                        value={total(values) - values.deposit}
                        displayType={'text'}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={'R$'}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        renderText={value => value}
                    />
                    <br />
                    Peças: {values ? totalItems(values): '0'}
                </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                    : (<span><FontAwesomeIcon icon={faSave} size="lg" /></span>)}
                &nbsp;Salvar
            </button>
            { values.id && (
                <button type="button" onClick={receiptGenerate} disabled={loadingReceipt} className="btn btn-success btn-block">
                    {loadingReceipt ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                        : (<span><FontAwesomeIcon icon={faReceipt} size="lg" /></span>)}
                    &nbsp;Recibo
                </button>
            )}
            <CopyToClipboard 
                text={orderText}
            >
                <button type="button" className="btn btn-info btn-block">
                    <span><FontAwesomeIcon icon={faClipboard} size="lg" /></span>
                    &nbsp;Copiar pedido para a memória
                </button>
            </CopyToClipboard>

        </form>
    )  
}

const total = values => {
    const _total = values.order_items
        ? values.order_items.reduce((sum, i) => (
            sum += i.quantity * i.value
        ), 0)
        : 0
    return _total - (values.discount ?? 0);
}

const totalItems = values => {
    const _total = values.order_items
        ? values.order_items.reduce((sum, i) => (
            sum += Number(i.quantity)
        ), 0)
        : 0
    return _total;
}

const createOrderText = values => {
    const days = moment(values.date_back).diff(moment(values.date_pickup), 'days')
    const date_pickup = moment(values.date_pickup).format('DD/MM/YYYY')
    const date_back = moment(values.date_back).format('DD/MM/YYYY')

    let text = ''

    text += values && values.customer && `Pedido de ${values.customer.name}\n`
    text += `Tema: ${values.description}\n`
    text += `Data de retirada: ${date_pickup}\n`
    text += `Data de devolução: ${date_back}\n`
    text += `Dias totais: ${days}\n`
    text += `Produtos:\n`
    values.order_items && values.order_items.forEach(
        item => {
            text += `${normalizeToCurrency(item.value)} x${item.quantity} - ${item.item.name} \n`
        }
    )
    text += `Total de peças: ${(values.order_items && totalItems(values)) || '0'}\n`
    text += `Valor Total: ${normalizeToCurrency(total(values) + ((values.discount && values.discount > 0) ? values.discount: 0))}\n`
    if (values.discount && values.discount > 0) text += `Valor do Desconto: ${normalizeToCurrency(values.discount)}\n`
    text += `Valor Final: ${normalizeToCurrency(total(values))}\n`
    text += `\nO Desconto apresentado deverá ser considerado em pagamentos via pix ou transferência, até a data da retirada das peças.\n`
    text += `\nPara reserva das peças é necessário que seja feito um sinal. Caso haja cancelamento ou desistência, o valor do sinal, fica como credito para uma próxima locação.\n`
    return text;
}

export default OrderForm;