import React from 'react';

import './Home.css';
import logo from '../assets/medeirostec_logo.png'

export default function Home({ history }) {
    return (
        <div className="container">
            <div className="content">
                <img src={logo} alt="MedeirosTEC" />
                <p>
                    Seja bem vindo CMS MedeirosTEC!
                </p>
                <p>
                    CMS (Content Management System) é um sistema de controle de conteúdos.<br /><br />
                    Faça o <a href="/login">login</a>.<br />
                    Não tem conta? <a href="/signup">Cadastre-se</a><br />
                </p>
            </div>
        </div>
    );
}