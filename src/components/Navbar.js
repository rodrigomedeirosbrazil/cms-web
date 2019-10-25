import React from 'react';
import { Navbar as BSNavbar, Nav } from 'react-bootstrap';

export default function Navbar({ history }) {
    return (
        <BSNavbar bg="light" expand="lg">
            <BSNavbar.Brand href="/main">CMS MedeirosTEC</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/customers">Clientes</Nav.Link>
                    <Nav.Link href="/items">Produtos</Nav.Link>
                    <Nav.Link href="/orders">Pedidos</Nav.Link>
                </Nav>
                <Nav className="justify-content-end">
                    <Nav.Link href="/login">Sair</Nav.Link>
                </Nav>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
}