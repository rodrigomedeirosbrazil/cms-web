const normalizeCnpj = value => {
    if (!value) return value;

    let cnpj = value + '';
    if (cnpj.length > 18)
        cnpj.slice(0, 18);
    else {
        cnpj = cnpj.replace(/\D/g, ""); // somente os numeros
        cnpj = cnpj.replace(/(\d{2})(\d)/, "$1.$2");
        cnpj = cnpj.replace(/(\d{3})(\d)/, "$1.$2");
        cnpj = cnpj.replace(/(\d{3})(\d)/, "$1/$2");
        cnpj = cnpj.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cnpj.slice(0, 18);
}

export default normalizeCnpj