import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSearch } from '@fortawesome/free-solid-svg-icons';
import cep from 'cep-promise';
import useForm from 'react-hook-form';
import InputMask from "react-input-mask";

const CustomerForm = ({values, setValues, onSubmit, loading}) => {
    const { register, handleSubmit, errors } = useForm();
    const [loadingCep, setLoadingCep] = useState(false);

    const searchCep = () => {
        console.log('consultando cep ' + values.zip);
        setLoadingCep(true);
        
        cep(values.zip)
        .then((data) => {
            setLoadingCep(false);
            const address = data.street + ', - ' + data.neighborhood;
            const city = data.city;
            const state = data.state;
            setValues({ ...values, address, city, state })
        })
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            { values.id && (
                <input type="hidden" name="id" defaultValue={values.id || ''} ref={register} />
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
                    ref={register({ required: true })}
                />
                <span className="text-danger">{errors.name && 'Nome é requerido'}</span>
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
                    ref={register}
                />
                <span className="text-danger">{errors.email && errors.email.message}</span>
            </div>
            <div className="form-group">
                <label>CEP</label>
                <div className="row">
                    <div className="col-10">
                        <InputMask mask="99.999-999"
                            className="form-control"
                            onChange={handleChange}
                            defaultValue={values.zip || ''}
                            name="zip"
                            ref={register}
                        />
                    </div>
                    <div className="col-2">
                        <button onClick={searchCep} disabled={loadingCep} className="btn btn-primary">
                            {loadingCep ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                                : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                        </button>
                    </div>
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
                    ref={register}
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
                    ref={register}
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
                    ref={register}
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

export default CustomerForm;