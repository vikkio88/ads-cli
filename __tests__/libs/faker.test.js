import {faker} from '../../libs/generator/faker';

describe('faker test', () => {
    test('name generation', () => {
        expect(faker.name('it')).not.toBe(undefined);
    });

    test('surname generation', () => {
        expect(faker.surname('it')).not.toBe(undefined);
    });

    test('city generation', () => {
        expect(faker.city('it')).not.toBe(undefined);
    });

});