const extendedNationalities = {
    'it': {
        name: 'Italy',
        flag: 'IT'
    },
    'en': {
        name: 'England',
        flag: 'GB'
    },
    'ru': {
        name: 'Russia',
        flag: 'RU'
    },
    'es': {
        name: 'Spain',
        flag: 'ES'
    },
    'de': {
        name: 'Germany',
        flag: 'DE'
    },
    'tr': {
        name: 'Turkey',
        flag: 'TR'
    },
    'fr': {
        name: 'France',
        flag: 'FR'
    },
    'ja': {
        name: 'Japan',
        flag: 'JP'
    },
    'nl': {
        name: 'Netherlands',
        flag: 'NL'
    },
    'cz': {
        name: 'Czech Republic',
        flag: 'CZ'
    }

};

const nationalities = [
    'it', 'en', 'es', 'de', 'fr', 'nl', 'tr', 'cz'
];

const nations = nationalities.map(n => extendedNationalities[n].name);

export {nationalities, extendedNationalities, nations};