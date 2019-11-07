import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';
import { LinkContainer as Link} from 'react-router-bootstrap'

export default function Navbar({ history }) {
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
                <Nav className="justify-content-end">
                    <Link to="/login"><Nav.Link>Sair</Nav.Link></Link>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
}