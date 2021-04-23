const nullToEmpty = value => {
    const _value = value + '';
    if (_value === 'null') return ''
}

export default nullToEmpty