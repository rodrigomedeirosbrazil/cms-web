import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

import api from '../services/api';
import logo from '../assets/medeirostec_logo.png'
import Modal from '../components/Modal';

export default function RecoveryPassword({ history }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [getError, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/recoveryPassword', { email });
            setShowModal(true);
        } catch (error) {
            console.log('erro', error.response);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Não foi recuperar a senha, tente novamente mais tarde.');
            }
        }
        setLoading(false);
    }

    return (
        <div className="container h-100 d-flex justify-content-center align-items-center">
            <Modal
                show={showModal}
                setShow={setShowModal}
                header="Sucesso"
                body="Uma nova senha foi enviada para seu email."
                showCancel={false}
                onClose={() => history.push('/')}
            />
            <div className="d-flex flex-column align-items-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <img src={logo} alt="MedeirosTEC" />
                    </div>
                    <h1 className="text-center p-2">Recuperação de senha</h1>
                    <div className="form-group">
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Digite seu email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary btn-block" ><span><FontAwesomeIcon icon={faLock}  size="lg"/></span> Recuperar</button>
                    <div className="p-2 text-center">
                        {loading && (<div className="spinner-border" role="status"></div>)}
                        {getError && (<span>{getError}</span>)}
                    </div>
                </form>
            </div>
        </div>
    );
}