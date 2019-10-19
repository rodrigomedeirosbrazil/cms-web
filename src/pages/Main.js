import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap';

import logo from '../assets/medeirostec_logo.png'
import { getAuth } from '../services/auth';
import Navbar from '../components/Navbar'

export default function Main ({ history }) {
    const [name, setName] = useState('');

    useEffect(
        () => {
            const auth = getAuth();
            setName(auth.user.name);
        }
    , [])

    return (
        <>
        <Navbar></Navbar>
        <div className="container-fluid">
            <div className="row" style={{ marginTop: 50 }}>
                <div className="col-md-4 offset-md-4">
                    <p className="text-center"><img src={ logo } alt="MedeirosTEC" /></p>
                    <p className="text-center">Bem vindo <b>{ name }</b>!</p>

                    <ListGroup>
                        <ListGroup.Item action href="/costumers">
                            Clientes
                            <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                        </ListGroup.Item>
                        <ListGroup.Item action href="/items">
                            Produtos
                            <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                        </ListGroup.Item>
                        <ListGroup.Item action href="/orders">
                            Pedidos
                            <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                        </ListGroup.Item>
                        <ListGroup.Item action href="/reports" disabled>
                            Relatórios
                            <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </div>
        </div>
        </>
    );
}