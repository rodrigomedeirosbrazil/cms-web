import normalizeCpf from './normalizeCpf';
import normalizeCnpj from './normalizeCnpj';
import onlyNumbers from './onlyNumbers';

const normalizeDoc = value => {
    if (!value) return value;
    const _value = value + '';
    const _valueNumbers = onlyNumbers(_value);

    if (_valueNumbers.length > 11 )
        return normalizeCnpj(value);
    else
        return normalizeCpf(value);
}
export default normalizeDoc