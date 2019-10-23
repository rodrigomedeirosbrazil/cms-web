import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import logo from '../assets/medeirostec_logo.png'

export default function Home({ history }) {
    return (
        <div className="container h-100 d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column align-items-center">
                <img src={logo} alt="MedeirosTEC" />
                <p>Seja bem vindo CMS MedeirosTEC!</p>
                <p>CMS (Content Management System) é um sistema de controle de conteúdo.</p>
                <div className="row">
                    <div className="col">
                        Já tem conta? <Button type="submit" href="/login" variant="outline-info"><span><FontAwesomeIcon icon={faSignInAlt}  size="lg"/></span> Login</Button>
                    </div>
                </div><br />
                <div className="row">
                    <div className="col">
                        Não tem conta? <Button type="submit" href="/signup" variant="outline-info"><span><FontAwesomeIcon icon={faUserPlus}  size="lg"/></span> Cadastre-se</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}