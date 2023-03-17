const nullToEmpty = value => {
    const _value = value + '';
    if (_value === 'null' || _value === 'undefined') return ''
    return value;
}

export default nullToEmpty