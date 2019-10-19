import React from 'react';
import { Button } from 'react-bootstrap';

import logo from '../assets/medeirostec_logo.png'

export default function Home({ history }) {
    return (
        <div className="container h-100 d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column align-items-center">
                <img src={logo} alt="MedeirosTEC" />
                <p>Seja bem vindo CMS MedeirosTEC!</p>
                <p>CMS (Content Management System) é um sistema de controle de conteúdo.</p>
                <Button type="submit" href="/login" variant="outline-info">Login</Button>
                Não tem conta? <Button type="submit" href="/signup" variant="outline-info">Cadastre-se</Button>
            </div>
        </div>
    );
}