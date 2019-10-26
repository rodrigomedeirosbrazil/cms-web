import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

import MoneyInput from '../components/MoneyInput';

const ItemForm = ({values, setValues, onSubmit, loading}) => {
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        if (values.name === '') {
            setErrors({ name: 'Campo obrigatório' });
            return;
        }
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit}>
            { values.id && (
                <input type="hidden" name="id" defaultValue={values.id || ''}/>
            )}
            <div className="form-group">
                <label>Nome</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite o nome" 
                    onChange={handleChange} 
                    defaultValue={values.name || ''}
                    name="name"
                />
                <span className="text-danger">{errors.name && 'esse campo é obrigatório'}</span>
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite a descrição"
                    onChange={handleChange}
                    defaultValue={values.description || ''}
                    name="description"
                />
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="form-group">
                        <label>Valor</label>
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">R$</div>
                            </div>
                            <MoneyInput
                                className="form-control"
                                name="value"
                                value={values.value || "0.00"}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label>Valor de reposição</label>
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <div className="input-group-text">R$</div>
                            </div>
                            <MoneyInput
                                className="form-control"
                                name="value_repo"
                                value={values.value_repo || "0.00"}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>Quantidade</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Digite a quantidade"
                    onChange={handleChange}
                    defaultValue={values.quantity || ''}
                    name="quantity"
                />
            </div>
            <div className="row">
                <div className="col-4">
                    <div className="form-group">
                        <label>Largura (cm)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Digite a largura"
                            onChange={handleChange}
                            defaultValue={values.width || ''}
                            name="width"
                        />
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-group">
                        <label>Altura (cm)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Digite a altura"
                            onChange={handleChange}
                            defaultValue={values.height || ''}
                            name="height"
                        />
                    </div>
                </div>
                <div className="col-4">
                    <div className="form-group">
                        <label>Profundidade (cm)</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Digite a profundidade"
                            onChange={handleChange}
                            defaultValue={values.length || ''}
                            name="length"
                        />
                    </div>
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

export default ItemForm;