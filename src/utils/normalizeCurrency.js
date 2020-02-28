export default (viewValue) => {
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