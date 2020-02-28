import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSearch } from '@fortawesome/free-solid-svg-icons';
import cep from 'cep-promise';
import MaskedInput from 'react-text-mask'

import DocInput from '../components/DocInput';

const UserForm = ({values, setValues, onSubmit, loading}) => {
    const [loadingCep, setLoadingCep] = useState(false);
    const [errors, setErrors] = useState({});

    const searchCep = () => {
        console.log('consultando cep ' + values.zip);
        setLoadingCep(true);
        
        cep(values.zip)
        .then((data) => {
            setLoadingCep(false);
            const address = data.street;
            const neighborhood = data.neighborhood;
            const city = data.city;
            const state = data.state;
            setValues({ ...values, address, city, state, neighborhood })
        })
        .catch(() => {
            alert('Não foi possível encontrar o CEP');
            setLoadingCep(false);
        })
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        if(values.name === '') {
            setErrors({name: 'Campo obrigatório'});
            return;
        }
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit}>
            { values.id && (
                <input type="hidden" name="id" defaultValue={values.id || ''} />
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
                <span className="text-danger">{errors.name && 'Esse campo é obrigatório'}</span>
            </div>
            <div className="form-group">
                <label>Email</label>
                <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Digite o email" 
                    onChange={handleChange} 
                    defaultValue={values.email || ''}
                    name="email"
                />
                <span className="text-danger">{errors.email && errors.email.message}</span>
            </div>
            <div className="form-group">
                <label>Nome Social</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o nome"
                    onChange={handleChange}
                    defaultValue={values.social_name || ''}
                    name="social_name"
                />
                <span className="text-danger">{errors.name && 'Esse campo é obrigatório'}</span>
            </div>
            <div className="form-group">
                <label>Nome Fantasia</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o nome"
                    onChange={handleChange}
                    defaultValue={values.fantasy_name || ''}
                    name="fantasy_name"
                />
                <span className="text-danger">{errors.name && 'Esse campo é obrigatório'}</span>
            </div>
            <div className="form-group">
                <label>CPF/CNPJ</label>
                <DocInput
                    className="form-control"
                    name="doc"
                    value={values.doc || ''}
                    onChange={handleChange}
                />
                <span className="text-danger">{errors.doc && errors.doc.message}</span>
            </div>
            <div className="form-group">
                <label>Telefone</label>
                <MaskedInput
                    mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    className="form-control"
                    onChange={handleChange}
                    defaultValue={values.phone || ''}
                    placeholder="Digite o número do telefone"
                    name="phone"
                />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text">CEP</label>
                </div>
                <MaskedInput 
                    mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                    className="form-control"
                    onChange={handleChange}
                    defaultValue={values.zip || ''}
                    placeholder="Digite o CEP e aperte o botão para auto-completar os outros campos."
                    name="zip"
                />
                <div className="input-group-append">
                    <button type="button" onClick={searchCep} disabled={loadingCep} className="btn btn-primary">
                        {loadingCep ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                            : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                    </button>
                </div>
            </div>
            <div className="form-group">
                <label>Endereço completo</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite o endereço completo" 
                    onChange={handleChange} 
                    defaultValue={values.address || ''}
                    name="address"
                />
            </div>
            <div className="form-group">
                <label>Bairro</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Digite a Cidade"
                    onChange={handleChange}
                    defaultValue={values.neighborhood || ''}
                    name="neighborhood"
                />
            </div>
            <div className="form-group">
                <label>Estado (UF)</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite o Estado. Exemplo: SP, BA, RJ" 
                    onChange={handleChange} 
                    defaultValue={values.state || ''}
                    name="state"
                />
            </div>
            <div className="form-group">
                <label>Cidade</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite a Cidade" 
                    onChange={handleChange} 
                    defaultValue={values.city || ''}
                    name="city"
                />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                    : (<span><FontAwesomeIcon icon={faSave} size="lg" /></span>)}
                &nbsp;Salvar
            </button>
        </form>
    )  
}

export default UserForm;