import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import api from '../services/api';
import { getAuth } from '../services/auth';

export default function ChangePassword({ history }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [getError, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const auth = getAuth();
        try {
            await api.post(
                '/auth/changePassword', 
                { oldPassword, newPassword },
                {
                    headers: {
                        Authorization: 'Bearer ' + ( auth ? auth.token : '')
                    }
                }
            );
            setShowModal(true);
        } catch (error) {
            console.log('erro', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Não foi possível trocar a senha, tente novamente mais tarde.');
            }
        }
        setLoading(false);
    }

    return (
        <>
            <Navbar />
            <Modal 
                show={showModal} 
                setShow={setShowModal} 
                header="Sucesso" 
                body="Sua senha foi alterada com sucesso!" 
                showCancel={false} 
                onClose={ () => history.push('/main') } 
            />
            
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-6 offset-md-3">
                        <h2>Trocar a senha: </h2>
                        {getError && (
                            <div className="alert alert-danger" role="alert">
                                Houve um erro: {getError}
                            </div>
                        )}
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Senha atual</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        onChange={
                                            event => {
                                                setOldPassword(event.target.value);
                                            }
                                        }
                                        value={oldPassword || ''}
                                        name="oldPassword"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nova senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        onChange={
                                            event => {
                                                setNewPassword(event.target.value);
                                            }
                                        }
                                        value={newPassword || ''}
                                        name="newPassword"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                                    {loading ? (<div className="spinner-border spinner-border-sm" role="status"></div>)
                                        : (<span><FontAwesomeIcon icon={faSave} size="lg" /></span>)}
                                    &nbsp;Trocar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}