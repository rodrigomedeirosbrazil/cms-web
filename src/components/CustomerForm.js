import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import cep from 'cep-promise';
import { useDebouncedCallback } from 'use-debounce';
import useForm from 'react-hook-form'

const CustomerForm = ({values, setValues, onSubmit, loading}) => {
    const { register, handleSubmit, errors } = useForm();

    const [debouncedCallback] = useDebouncedCallback(
        (zip) => {
            console.log('consultando cep ' + zip);
            cep(zip)
                .then((data) => {
                    console.log(data);
                    const address = data.street + ', - ' + data.neighborhood;
                    const city = data.city;
                    const state = data.state;
                    setValues({ ...values, address, city, state })
                })
        },
        // delay in ms
        1000
    );

    const handleChange = (event) => {
        if (event.target.name === 'zip') {
            debouncedCallback(event.target.value)
        }

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
                <input 
                    type="zip" 
                    className="form-control" 
                    placeholder="Digite o CEP" 
                    onChange={handleChange} 
                    defaultValue={values.zip || ''}
                    name="zip"
                    ref={register}
                />
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