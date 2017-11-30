const extendedNationalities = {
    'it': {
        name: 'Italy',
        flag: 'IT',
        currency: '€'
    },
    'en': {
        name: 'England',
        flag: 'GB',
        currency: '£'
    },
    'ru': {
        name: 'Russia',
        flag: 'RU',
        currency: '€'
    },
    'es': {
        name: 'Spain',
        flag: 'ES',
        currency: '€'
    },
    'de': {
        name: 'Germany',
        flag: 'DE',
        currency: '€'
    },
    'tr': {
        name: 'Turkey',
        flag: 'TR',
        currency: '€'
    },
    'fr': {
        name: 'France',
        flag: 'FR',
        currency: '€'
    },
    'ja': {
        name: 'Japan',
        flag: 'JP',
        currency: '¥'
    },
    'nl': {
        name: 'Netherlands',
        flag: 'NL',
        currency: '€'
    },
    'cz': {
        name: 'Czech Republic',
        flag: 'CZ',
        currency: '€'
    }

};

const nationalities = [
    'it', 'en', 'es', 'de', 'fr', 'nl', 'tr', 'cz'
];

const nations = nationalities.map(n => extendedNationalities[n].name);
const nationsAssoc = {};
nationalities.forEach(n => nationsAssoc[n] = extendedNationalities[n].name);

export {nationalities, extendedNationalities, nations, nationsAssoc};