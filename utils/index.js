import numeral from 'numeral';

const percentageModify = (value, modifier) => Math.max(Math.min(100, value + modifier), 0);
const ucFirst = value => `${value.charAt(0).toUpperCase()}${value.substr(1)}`;
const range = amount => Array.apply(null, new Array(amount));
const rangeArray = amount => range(amount).map((_, index) => index + 1);
const objectFlip = object => {
    const flipped = {};
    Object.keys(object).forEach(k => {
        flipped[object[k]] = k;
    });
    return flipped;
};
const format = (...args) => {
    const string = args.shift();
    return string.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};
const formatCurrency = (number, currency = '€') => `${numeral(number).format('(0.00 a)')} ${currency}`;


export {ucFirst, range, rangeArray, format, formatCurrency, percentageModify, objectFlip};