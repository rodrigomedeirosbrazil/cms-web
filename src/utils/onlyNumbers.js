const onlyNumbers = value => {
    if (!value) return value;
    const _value = value + '';
    return _value.replace(/\D/g, ""); // somente os numeros
}

export default onlyNumbers