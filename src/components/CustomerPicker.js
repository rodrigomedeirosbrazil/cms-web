import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ListGroup } from 'react-bootstrap';

const CUSTOMERS = gql`
    query ($name: String!) {
        customers (where: {name: {_ilike: $name} , active: {_eq: true}}, order_by: {name: asc, id: asc}, limit: 10) { 
            id, name 
        }
    }
`;

const CustomerPicker = ({ onChange, error }) => {
    const [name, setName] = useState('');
    const [searchCustomers, { data, loading }]  = useLazyQuery(CUSTOMERS);

    const handleSearch = (event) => {
        if (name !== '')
            searchCustomers({ variables: { name: `%${name}%` } });
    }

    return (
        <>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className={error ? 'form-control is-invalid' : 'form-control' }
                    placeholder="Digite o nome de um cliente"
                    name="name"
                    value={name}
                    onChange={ event => {
                        setName(event.target.value);
                    } }
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
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
            <ListGroup>
                {data && data.customers && data.customers.length > 0 ? data.customers.map(
                        item => (
                            <ListGroup.Item 
                                action key={item.id} 
                                onClick={ 
                                    (event) => {
                                        event.preventDefault();
                                        onChange(item.id, item.name);
                                    }
                                }
                            >
                                {item.name}
                            </ListGroup.Item>
                        )
                    ) : name !== '' && data && (
                        <ListGroup.Item>
                            Nada encontrado
                        </ListGroup.Item>
                )}
            </ListGroup>
        </>
    )  
}

export default CustomerPicker;