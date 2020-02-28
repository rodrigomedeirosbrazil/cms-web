export default number => {
    if (typeof number === 'number') number = number.toFixed(2);
    return number.replace('.', ',');
}