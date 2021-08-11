
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import qs from 'query-string';

const OrderSearch = (props) => {

    const [searchType, setSearchType] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(
        () => {
            const parsedQuery = qs.parse(props.history.location.search);
            setSearchType(parsedQuery.searchType ? parseInt(parsedQuery.searchType) : 0);
            setSearchTerm(parsedQuery.searchTerm ? parsedQuery.searchTerm : '');
            setStartDate(parsedQuery.startDate ? parsedQuery.startDate : '');
            setEndDate(parsedQuery.endDate ? parsedQuery.endDate : '');
        },
        // eslint-disable-next-line
        [props.history.location.search]
    )

    const handleSearch = () => {
        props.handleSearch({
            searchTerm, searchType, startDate, endDate
        });
    }

    return (
        <div className="row">
            <div className="col-md-8 offset-md-2">
                {searchType !== 2 ? (
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className='form-control'
                            placeholder="Digite a busca"
                            name="search"
                            value={searchTerm}
                            onChange={event => {
                                setSearchTerm(event.target.value);
                            }}
                            onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                        />
                        <div className="input-group-append">
                            <button onClick={handleSearch} disabled={props.loading} type="button" className="btn btn-primary">
                                {props.loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                                    : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row align-items-center">
                        <div className="col-5">
                            <div className="form-group">
                                <label>Data Início</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={event => {
                                        setStartDate(event.target.value);
                                    }}
                                    name="date_pickup"
                                    value={startDate}
                                />
                            </div>
                        </div>
                        <div className="col-5">
                            <div className="form-group">
                                <label>Data Final</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    onChange={event => {
                                        setEndDate(event.target.value);
                                    }}
                                    name="date_back"
                                    value={endDate}
                                />
                            </div>
                        </div>
                        <div className="col-2">
                            <button onClick={handleSearch} disabled={props.loading} type="button" className="btn btn-primary">
                                {props.loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                                    : (<span><FontAwesomeIcon icon={faSearch} size="lg" /></span>)}
                            </button>
                        </div>
                    </div>
                )}
                <div className="row mb-4">
                    <div className="col" onClick={() => setSearchType(0)}>
                        <span className="mr-2"><FontAwesomeIcon icon={searchType === 0 ? faCheckCircle : faCircle} size="lg" /></span>Por Descrição
                    </div>
                    <div className="col" onClick={() => setSearchType(1)}>
                        <span className="mr-2"><FontAwesomeIcon icon={searchType === 1 ? faCheckCircle : faCircle} size="lg" /></span>Por Cliente
                    </div>
                    <div className="col" onClick={() => setSearchType(2)}>
                        <span className="mr-2"><FontAwesomeIcon icon={searchType === 2 ? faCheckCircle : faCircle} size="lg" /></span>Por Data de Retirada
                    </div>
                </div>
            </div>
        </div>
    )  
}

export default OrderSearch;