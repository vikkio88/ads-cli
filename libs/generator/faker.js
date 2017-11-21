import {randomizer} from './randomizer';
import person from '../../config/providers/person';
import cities from '../../config/providers/cities';


const faker = {
    name(locale){
        return randomizer.pickOne(person[locale].names);
    },
    surname(locale){
        return randomizer.pickOne(person[locale].surnames);
    },
    city(locale){
        return randomizer.pickOne(cities[locale].cities);
    },
};

export {faker};