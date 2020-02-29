import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';
import api from '../services/api';
import { getAuth } from '../services/auth';

export default function Profile ({ history }) {
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [getError, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(
        () => {
            loadUserData();
        },
        // eslint-disable-next-line
        []
    )

    const loadUserData = async () => {
        setLoading(true);
        setError('');
        try {
            const auth = getAuth();
            const response = await api.post('/auth/me', 
                null, 
                {
                    headers: {
                        Authorization: 'Bearer ' + (auth ? auth.token : '')
                    }
                }
            );
            if (response.status === 200) {
                setValues(response.data);
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log('erro', error.response);
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Não foi possível fazer receber os dados, tente novamente mais tarde.');
            }
        }
        setLoading(false);
    }

    const setUserData = async () => {
        setLoading(true);
        setError('');
        const auth = getAuth();
        try {
            await api.post(
                '/auth/update',
                { ...values },
                {
                    headers: {
                        Authorization: 'Bearer ' + (auth ? auth.token : '')
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

    const onSubmit = (data) => {
        setValues(data);
        setUserData();
    }

    return (
        <>
            <Navbar />
            <Modal
                show={showModal}
                setShow={setShowModal}
                header="Sucesso"
                body="Sua perfil foi alterado com sucesso!"
                showCancel={false}
                onClose={() => history.push('/main')}
            />
            <div className="container-fluid">
                <div className="row" style={{ marginTop: 50 }}>
                    <div className="col-md-6 offset-md-3">
                        <h2>Meu perfil: </h2>
                        { 
                            loading ? 
                                (
                                    <div className="spinner-border" role="status"></div>
                                ) : 
                            getError ? 
                                (
                                    <h3>Houve um erro: {getError}</h3>
                                ) :
                                (
                                    <div>
                                        <UserForm values={values} setValues={setValues} onSubmit={onSubmit} loading={loading} />
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}