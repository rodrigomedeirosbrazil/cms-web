import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ListGroup } from 'react-bootstrap';
import { LinkContainer as Link } from 'react-router-bootstrap'
import moment from 'moment';
import 'moment/locale/pt-br';

import logo from '../assets/medeirostec_logo.png'
import { getAuth } from '../services/auth';
import Navbar from '../components/Navbar'

export default function Main ({ history }) {
    moment.locale('pt-br');
    const [name, setName] = useState('');
    const [dateLimit, setDateLimit] = useState('');

    useEffect(
        () => {
            const auth = getAuth();
            if (auth) {
                setName(auth.user.name);
                setDateLimit(auth.user.date_limit);
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
                    <p className="text-center">Bem vindo <b>{name}</b>!</p>
                        {dateLimit && (<p className="text-center">Sua assinatura vence {moment(dateLimit).fromNow()} ({moment(dateLimit).format('DD/MM/YYYY')})</p>)}

                    <ListGroup>
                        <Link to="/customers">
                            <ListGroup.Item action>
                                Clientes
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                        <Link to="/items">
                            <ListGroup.Item action>
                                Produtos
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                        <Link to="/orders">
                            <ListGroup.Item action>
                                Pedidos
                                <FontAwesomeIcon icon={ faChevronRight } className="float-right" />
                            </ListGroup.Item>
                        </Link>
                        <Link to="/reports">
                            <ListGroup.Item action disabled>
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