import React, { useState, useEffect } from 'react';
import { Navbar as BSNavbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer as Link} from 'react-router-bootstrap'
import { getAuth } from '../services/auth';

export default function Navbar({ history }) {
    const [name, setName] = useState('');

    useEffect(
        () => {
            const auth = getAuth();
            if (auth) {
                setName(auth.user.name);
            }
        }
        , []
    )

    return (
        <BSNavbar bg="light" expand="lg">
            <Link to="/main"><BSNavbar.Brand>CMS MedeirosTEC</BSNavbar.Brand></Link>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/customers"><Nav.Link active={window.location.pathname === '/customers'}>Clientes</Nav.Link></Link>
                    <Link to="/items"><Nav.Link active={window.location.pathname === '/items'}>Produtos</Nav.Link></Link>
                    <Link to="/orders"><Nav.Link active={window.location.pathname === '/orders'}>Pedidos</Nav.Link></Link>
                </Nav>
                <NavDropdown title={name || 'Usuário'} className="justify-content-end">
                    <Link to="/change_password"><Nav.Link>Trocar senha</Nav.Link></Link>
                    <Link to="/login"><Nav.Link>Sair</Nav.Link></Link>
                </NavDropdown>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
}