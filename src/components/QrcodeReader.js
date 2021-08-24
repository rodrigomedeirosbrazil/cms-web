import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import switchCamera from '../assets/switch_camera.png'
import qrcodeIcon from '../assets/qrcode_icon.png'

const QrcodeReader = ( { handleScan }) => {
    const [openCamera, setOpenCamera] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');

    const handleReaderScan = data => {
        if (!data) return;
        handleScan(data);
    }

    return (
        <>
            <div className="text-center mb-2">
                <button
                    type="button"
                    className="btn btn-outline-primary m-2"
                    onClick={
                        (event) => {
                            event.preventDefault();
                            setOpenCamera(!openCamera);
                        }
                    }
                >
                    <span><img src={qrcodeIcon} alt="Ler QRCODE" width="50"></img></span>
                </button>
                { openCamera &&
                    <>
                        <QrReader
                            delay={300}
                            onScan={handleReaderScan}
                            facingMode={facingMode}
                        />

                        <button
                        type="button"
                        className="btn btn-outline-primary m-2"
                        onClick={
                            (event) => {
                                event.preventDefault();
                                setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
                            }
                        }
                        >
                            <span><img src={switchCamera} alt="Switch Camera" width="50"></img></span>
                        </button>
                    </>
                }
            </div>
        </>
    );
}

export default QrcodeReader