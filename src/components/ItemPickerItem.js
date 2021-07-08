import React from 'react';
import NumberFormat from 'react-number-format';
import noPhotoDataUri from '../assets/noPhotoDataUri'

const ItemPickerItem = ({ item, index, onChange, removeItem  }) => {

    return (
        <div className="card mb-2">
            <div 
                className={
                    item.stock < 1 
                    ? 'card-header text-white bg-danger'
                    : 'card-header text-white bg-secondary' 
                }
            >
                <a href={'/item/' + item.id} target="_blank" rel="noreferrer" style={{ color: "white" }}>
                    {item.name} #{item.idn}
                </a>
            </div>
            <div className="card-body p-1">
                <div className="row">
                    <div className="col">
                        <img alt={item.id} src={item.picture} className="img-thumbnail" width="100" 
                            onError={(e) => { e.target.onerror = null; e.target.src = noPhotoDataUri }}
                            onClick={
                                (event) => {
                                    event.preventDefault();
                                    onChange(item);
                                    removeItem(index);
                                }
                            }
                        />
                    </div>
                    <div className="col-7">
                        <div className="row">
                            <div className="col text-right">
                                <label>Qnt.:</label>
                            </div>
                            <div className="col text-left">
                                {item.quantity}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-right">
                                <label>Estoq.:</label>
                            </div>
                            <div className="col text-left">
                                {item.stock}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-right">
                                <label>Valor:</label>
                            </div>
                            <div className="col text-left">
                                <NumberFormat
                                    value={item.value}
                                    displayType={'text'}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={'R$ '}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    renderText={value => value}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )  
}

export default ItemPickerItem;