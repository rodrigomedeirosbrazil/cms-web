import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

import getCroppedImg from './cropImage'

const PicturePicker = ({ name, src, onChange, mime, compress }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [imgSrc, setImgSrc] = useState()
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [editing, setEditing] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])
    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imgSrc,
                croppedAreaPixels,
                rotation,
                160, 160,
                mime ? mime : null,
                compress ? compress : null
            )

            const returnEvent = {
                target: {
                    name,
                    value: croppedImage
                }
            }
            onChange(returnEvent);
            setEditing(false);
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels, rotation, imgSrc, name, onChange, mime, compress])

    const onFileChange = async e => {
        if (e.target.files && e.target.files.length > 0) {
            const imageDataUrl = await readFile(e.target.files[0])
            setImgSrc(imageDataUrl);
            editImage();
        }
    }

    const editImage = () => {
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setEditing(true);
    }

    const readFile = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    return (
        <>
            { !editing && (
            <>
                { src ? (
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <img alt="" src={src} className="img-fluid rounded" width="160"
                            onClick={
                                () => {
                                    setImgSrc(src);
                                    editImage();
                                }
                            }
                        />
                    </div>
                </div>
                ) : (
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <svg className="bd-placeholder-img rounded" width="160" height="160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img">
                            <rect width="100%" height="100%" fill="#868e96" />
                            <text x="25%" y="50%" fill="#dee2e6" dy=".3em">SEM FOTO</text>
                        </svg>
                    </div>
                </div>
                )}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="custom-file">
                                    <input type="file" className="custom-file-input" accept="image/*" onChange={onFileChange} />
                            <label className="custom-file-label" data-browse="Procurar">Escolha uma foto</label>
                        </div>
                    </div>  
                </div>
            </>
            )}
            { imgSrc && editing && (
            <>
                <div className="row mb-2" style={{ height: 250 }}>
                    <div className="col-12">
                        <Cropper
                            image={imgSrc}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            minZoom={0.1}
                            aspect={1 / 1}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropSize={{width: 160, height: 160}}
                        />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-12 text-center">
                        <button type="button" className="btn btn-light mr-2"
                            onClick={ (e) => {
                                setRotation(rotation - 90);
                            }}
                        >
                            <span><FontAwesomeIcon icon={faUndo} size="lg" /></span>
                        </button>
                        <button type="button" className="btn btn-light mr-2"
                            onClick={(e) => {
                                setRotation(rotation + 90);
                            }}
                        >
                            <span><FontAwesomeIcon icon={faUndo} size="lg" flip="horizontal"/></span>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <button type="button" className="btn btn-primary mr-2" onClick={showCroppedImage}>
                            OK
                        </button>
                        <button type="button" className="btn btn-primary mr-2" onClick={() => setEditing(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </>
            )}
        </>
    )  
}

export default PicturePicker;