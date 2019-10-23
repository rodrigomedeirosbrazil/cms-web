import React from 'react';

const CustomerForm = ({values, handleChange}) => {
    return (
        <>
            <div className="form-group">
                <label>Nome {values.name}</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite o nome" 
                    onChange={handleChange} 
                    value={values.name || ''}
                    name="name"
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Digite o email" 
                    onChange={handleChange} 
                    value={values.email || ''}
                    name="email"
                />
            </div>
            <div className="form-group">
                <label>CEP</label>
                <input 
                    type="zip" 
                    className="form-control" 
                    placeholder="Digite o CEP" 
                    onChange={handleChange} 
                    value={values.zip || ''}
                    name="zip"
                />
            </div>
            <div className="form-group">
                <label>Endereço completo</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite o endereço completo" 
                    onChange={handleChange} 
                    value={values.address || ''}
                    name="address"
                />
            </div>
            <div className="form-group">
                <label>Estado (UF)</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Digite o Estado. Exemplo: SP, BA, RJ" 
                    onChange={handleChange} 
                    value={values.state || ''}
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
                    value={values.city || ''}
                    name="city"
                />
            </div>
        </>
    )  
}

export default CustomerForm;