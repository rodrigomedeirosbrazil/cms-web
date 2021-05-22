import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import ItemPickerItem from './ItemPickerItem'
import graphql from '../services/graphql'
import getStock from '../services/stock'


const ITEMS = `
    query ($name: String!, $limit: Int!, $offset: Int!) {
        items (where: {name: {_ilike: $name}, active: {_eq: true}}, order_by: {name: asc}, limit: $limit, offset: $offset) { 
            id, idn, name, value, value_repo, quantity, picture
        }
    }
`;

const ItemPicker = ({ onChange, error, values }) => {
    const limit = 3;
    const [getPage, setPage] = useState(1);
    const [searchBox, setSearchBox] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    
    useEffect(() => {
        handleSearch();
    // eslint-disable-next-line
    }, [getPage, searchTerm])

    const handleSearch = async () => {
        if (searchLoading) return;

        if (searchTerm.trim() === '') {
            setItems([]);
            return;
        }

        setSearchLoading(true);

        try {
            const _data = await graphql(
                ITEMS,
                { name: `%${searchTerm.replace(/\s/g, '%')}%`, limit: limit, offset: (getPage - 1) * limit }
            );
            
            setLoadMore(true);

            if (_data.items.length === 0) {
                setLoadMore(false);
            } else if (values.date_pickup && values.date_back) {
                setItems([...items, ...await getStock(_data.items, values.id, values.date_pickup, values.date_back)]);
            } else {
                setItems([...items, ..._data.items]);
            }

        } catch (error) {
            console.log('erro', error);
            setItems([]);
        }

        setSearchLoading(false);
    }

    const removeItem = indexItem => {
        setItems(items.filter((item, index) => {
            return indexItem !== index
        }))
    }

    return (
        <>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className={error ? 'form-control is-invalid' : 'form-control' }
                    placeholder="Digite o nome de um produto"
                    name="name"
                    value={searchBox}
                    onChange={ event => {
                        setSearchBox(event.target.value);
                    } }
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                />
                <div className="input-group-append">
                    <button 
                        onClick={ event => { 
                            event.preventDefault();
                            setPage(1);
                            setItems([]);
                            setSearchTerm(searchBox);
                        }}
                        disabled={searchLoading} 
                        type="button" 
                        className="btn btn-primary"
                    >
                        {searchLoading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                            : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                    </button>
                </div>
                <div className="invalid-feedback">
                    {error}
                </div>
            </div>
            { items && items.length > 0 ? (
                items.map(
                    (item, index) => (
                        <ItemPickerItem key={item.id} item={item} index={index} onChange={onChange} removeItem={removeItem}/>
                ))
            ) : searchTerm !== '' && items && !searchLoading && !loadMore && (
                <div className="text-center mb-2">
                    <span>Nada encontrado</span>
                </div>
            )}
            {loadMore && (
                <div className="text-center mb-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={
                            (event) => {
                                event.preventDefault();
                                setPage(getPage + 1);
                            }
                        }
                    >
                        <span>Carregar mais itens</span>
                    </button>
                </div>
            )}
            {searchLoading && (
                <div className="text-center mb-2">
                    <div className="spinner-border spinner-border-lg" role="status"></div>
                </div>
            )}
        </>
    )  
}

export default ItemPicker;