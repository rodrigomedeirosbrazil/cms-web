import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import logo from '../assets/medeirostec_logo.png'
import { getAuth } from '../services/auth';
import Navbar from '../components/Navbar'

export default function Main ({ history }) {
    const [name, setName] = useState('');

    useEffect(
        () => {
            const auth = getAuth();
            if (auth) {
                setName(auth.user.name);
            }
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
                        <Link to="/customers">
                            <ListGroup.Item action>
                                Clientes
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                        <Link to="/items">
                            <ListGroup.Item action href="/items">
                                Produtos
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                        <Link to="/orders">
                            <ListGroup.Item action href="/orders">
                                Pedidos
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                        <Link to="/reports">
                            <ListGroup.Item action href="/reports" disabled>
                                Relatórios
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                    </ListGroup>
                </div>
            </div>
        </div>
        </>
    );
}