import React, { useState, useEffect } from 'react';

import normalizeDoc from '../utils/normalizeDoc';
import onlyNumbers from '../utils/onlyNumbers';

const DocInput = ({ className, name, value, onChange }) => {
    const [ view, setView ] = useState('');
    
    useEffect(
        () => {
            setView(normalizeDoc(value));
        },
        [value]
    )

    const handleChange = (event) => {
        event.preventDefault();
        const currency = normalizeDoc(event.target.value);
        const _model = onlyNumbers(currency);

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

export default DocInput;