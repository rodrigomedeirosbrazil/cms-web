const normalizeCpf = value => {
    if (!value) return value;

    let cpf = value + '';
    if (cpf && cpf.length > 14)
        cpf.slice(0, 14);
    else {
        cpf = cpf.replace(/\D/g, "");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cpf.slice(0, 14);
}

export default normalizeCpf