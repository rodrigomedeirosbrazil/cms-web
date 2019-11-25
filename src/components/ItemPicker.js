import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import NumberFormat from 'react-number-format';

const ITEMS = gql`
    query ($name: String!) {
        items (where: {name: {_ilike: $name}, active: {_eq: true}}, order_by: {name: asc}, limit: 10) { 
            id, name, value, value_repo, quantity
        }
    }
`;

const ItemPicker = ({ onChange, error }) => {
    const [name, setName] = useState('');
    const [searchItems, { data, loading }]  = useLazyQuery(ITEMS);

    const handleSearch = (event) => {
        if(name !== '')
            searchItems({ variables: { name: `%${name}%` } });
    }

    return (
        <>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className={error ? 'form-control is-invalid' : 'form-control' }
                    placeholder="Digite o nome de um produto"
                    name="name"
                    value={name}
                    onChange={ event => {
                        setName(event.target.value);
                    } }
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                />
                <div className="input-group-append">
                    <button onClick={handleSearch} disabled={loading} type="button" className="btn btn-primary">
                        {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                            : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                    </button>
                </div>
                <div className="invalid-feedback">
                    {error}
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <tbody>
                        {data && data.items && data.items.length > 0 ? data.items.map(
                            item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        <NumberFormat 
                                            value={item.value} 
                                            displayType={'text'} 
                                            thousandSeparator={'.'} 
                                            decimalSeparator={','} 
                                            prefix={'R$'} 
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            renderText={value => value}
                                        />
                                    </td>
                                    <td>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary btn-sm" 
                                            onClick={
                                                (event) => {
                                                    event.preventDefault();
                                                    onChange(item);
                                                }
                                            }
                                        >
                                            <span><FontAwesomeIcon icon={faPlusCircle} size="lg" /></span>
                                        </button>
                                    </td>
                                </tr>
                            )
                        ) : name !== '' && data && (
                            <tr>
                                <td colspan="3">Nada encontrado</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )  
}

export default ItemPicker;