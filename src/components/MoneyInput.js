import React, { useState, useEffect } from 'react';

import dotToComma from '../utils/dotToComma';
import commaToDot from '../utils/commaToDot';
import normalizeCurrency from '../utils/normalizeCurrency';

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