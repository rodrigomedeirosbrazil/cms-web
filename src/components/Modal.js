import React from 'react';
import { Button, Modal as BSModal } from 'react-bootstrap';

const Modal = ({show, setShow, header, body, onOk, value, onCancel, onClose, showCancel}) => {
    const handleClose = () => {
        setShow(false);
        if (onClose) onClose();
    }

    const handleOK = () => {
        handleClose();
        if(onOk) onOk(value);
    }

    const handleCancel = () => {
        handleClose();
        if (onCancel) onCancel();
    }

    return (
        <>
            <BSModal show={show} onHide={handleClose}>
                <BSModal.Header closeButton>
                    <BSModal.Title>{header}</BSModal.Title>
                </BSModal.Header>
                <BSModal.Body>{body}</BSModal.Body>
                <BSModal.Footer>
                    <Button variant="primary" onClick={handleOK}>
                        OK
                    </Button>
                    {showCancel && (
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancela
                    </Button>
                    )}
                </BSModal.Footer>
            </BSModal>
        </>
    );
}

export default Modal;
