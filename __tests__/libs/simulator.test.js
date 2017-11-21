import {generator, fixtureGenerator} from '../../libs/generator';
import {match, round} from '../../libs/simulator';

describe('match simulator tests', () => {
    test('simulates a game between returning result', () => {
        const home = generator.team();
        const away = generator.team();
        const result = match.simulate(home, away);
        expect(result).toEqual({
            home: expect.any(String),
            away: expect.any(String),
            winner: expect.any(String),
            loser: expect.any(String),
            isDraw: expect.any(Boolean),
            scorers: expect.anything(),
            homeGoal: expect.any(Number),
            awayGoal: expect.any(Number)
        });

        if (!result.isDraw) {
            expect(result.homeGoal > 0 || result.awayGoal > 0).toBe(true);
        }
    });
});

describe('round simulator tests', () => {
    test('simulates a round match by match', () => {
        const teams = generator.teams(4);
        const fixture = fixtureGenerator.generate(teams);
        const matches = fixture.pop().matches;
        const results = round.simulate(matches, teams);
        expect(results.length).toBe(teams.length / 2);
    });
});
