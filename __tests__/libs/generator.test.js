import moment from 'moment';
import {DATE_FORMAT} from '../../const';
import {generator} from '../../libs';
import {fixtureGenerator} from '../../libs/generator/fixtureGenerator';

describe('coach generator', () => {
    test('it generates a random player', () => {
        const coach = generator.coach();
        expect(coach).toEqual({
            name: expect.any(String),
            surname: expect.any(String),
            team: null,
            contract: expect.any(Number),
            status: expect.anything(),
            nationality: expect.any(String),
            age: expect.any(Number),
            wage: expect.any(Number),
            skill: expect.any(Number),
            module: expect.any(String)
        });
    });
    test('it generates a random coach, forcing module value', () => {
        const module = generator.module();
        const coach = generator.coach({module});
        expect(coach).toEqual({
            name: expect.any(String),
            surname: expect.any(String),
            team: null,
            contract: expect.any(Number),
            status: expect.anything(),
            nationality: expect.any(String),
            age: expect.any(Number),
            skill: expect.any(Number),
            wage: expect.any(Number),
            module
        });
    });

    test('it generates a random coach, forcing nationality value', () => {
        const nationality = generator.nationality();
        const coach = generator.coach({nationality});
        expect(coach).toEqual({
            name: expect.any(String),
            surname: expect.any(String),
            team: null,
            contract: expect.any(Number),
            status: expect.anything(),
            module: expect.any(String),
            age: expect.any(Number),
            skill: expect.any(Number),
            wage: expect.any(Number),
            nationality
        });
    });
});

describe('player generator', () => {
    test('it generates a random player', () => {
        const player = generator.player();
        expect(player).toEqual({
            name: expect.any(String),
            surname: expect.any(String),
            team: null,
            contract: expect.any(Number),
            status: expect.anything(),
            nationality: expect.any(String),
            age: expect.any(Number),
            skill: expect.any(Number),
            wage: expect.any(Number),
            value: expect.any(Number),
            position: expect.anything()
        });
    });

    test('it generates a random player, forcing position value', () => {
        const position = generator.position();
        const player = generator.player({position});
        expect(player).toEqual({
            name: expect.any(String),
            surname: expect.any(String),
            team: null,
            contract: expect.any(Number),
            status: expect.anything(),
            nationality: expect.any(String),
            age: expect.any(Number),
            wage: expect.any(Number),
            value: expect.any(Number),
            skill: expect.any(Number),
            position
        });
    });

    test('it generates a random player, forcing nationality value', () => {
        const nationality = generator.nationality();
        const player = generator.player({nationality});
        expect(player).toEqual({
            name: expect.any(String),
            surname: expect.any(String),
            team: null,
            contract: expect.any(Number),
            status: expect.anything(),
            position: expect.any(String),
            age: expect.any(Number),
            wage: expect.any(Number),
            value: expect.any(Number),
            skill: expect.any(Number),
            nationality
        });
    });
});

describe('team generator', () => {
    test('it generates a random team', () => {
        const team = generator.team();
        expect(team).toEqual({
            name: expect.any(String),
            status: expect.anything(),
            nationality: expect.any(String),
            finance: expect.any(Number),
            coach: expect.anything(),
            roster: expect.anything()
        });

        team.roster.forEach(p => {
            expect(p.team).toBe(team.name);
        })
    });
});

describe('fixture generator', () => {
    test('it generates a collection of matches, given an array of teams', () => {
        const teams = [
            {name: 'Juventus'},
            {name: 'Inter'},
            {name: 'Milan'},
            {name: 'Napoli'},
            {name: 'Roma'},
            {name: 'Fiorentina'}
        ];

        const startDate = moment(`01-09-${moment().format('YYYY')}`, DATE_FORMAT);
        const fixture = fixtureGenerator.generate(teams, startDate);
        expect(fixture.length).toBe((teams.length - 1) * 2);
    });
});
