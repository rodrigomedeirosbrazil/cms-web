import React, { useState, useEffect } from 'react';

const normalizeCurrency = (viewValue) => {
    if (viewValue.length <= 3) {
        viewValue = '00' + viewValue;
    }
    let value = viewValue;
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})$/, ",$1");
    value = value.replace(/(\d+)(\d{3},\d{2})$/g, "$1.$2");
    let qtdLoop = (value.length - 3) / 3;
    let count = 0;
    while (qtdLoop > count) {
        count++;
        value = value.replace(/(\d+)(\d{3}.*)/, "$1.$2");
    }
    let plainNumber = value.replace(/^(0)(\d)/g, "$2");

    return plainNumber;
}

const dotToComma = (number) => {
    if(typeof number === 'number') number = number.toFixed(2);
    return number.replace('.', ',');
}

const commaToDot = (number) => {
    return number.replace(/\./g, '').replace(',', '.');
}

const MoneyInput = ({ className, name, value, onChange }) => {
    const [ view, setView ] = useState('0,00');
    
    useEffect(
        () => {
            setView(normalizeCurrency(dotToComma(value)));
        },
        [value]
    )

    const handleChange = (event) => {
        event.preventDefault();
        const currency = normalizeCurrency(event.target.value);
        const _model = commaToDot(currency);

        const returnEvent = {
            target: {
                name,
                value: _model 
            }
        }
        onChange(returnEvent);
    }

    return (
        <input
            type="text"
            className={className}
            name={name}
            onChange={handleChange}
            value={view}
        />
    );
}

export default MoneyInput;