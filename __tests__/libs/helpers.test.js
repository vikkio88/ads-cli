import {teamHelper, playerHelper, generator, fixtureGenerator, round, leagueHelper} from '../../libs';
import {byTeamSkillAvgDesc} from '../../libs/misc'
import {range} from '../../utils';

describe('playerHelper tests', () => {
    test('it calculates the value in a reasonable range', () => {
        const players = [
            {p: {skill: 50, age: 20}, e: 100000},
            {p: {skill: 100, age: 20}, e: 130000000},
        ];
        players.forEach(t => {
            const playerValue = playerHelper.calculateValue(t.p);
            expect(playerValue).toBeGreaterThan(t.e);
        });
    });

    test('it calculates the wage in a reasonable range', () => {
        const players = [
            {skill: 50, age: 20},
            {skill: 100, age: 20},
            {skill: 100, age: 30},
        ];
        const expectedWages = [
            1000,
            1000000,
            1000000
        ];
        const playersWithValue = players.map(p => {
            const value = playerHelper.calculateValue(p);
            return {
                ...p,
                value
            };
        });

        playersWithValue.forEach((p, index) => {
            const wage = playerHelper.calculateWage(p);
            expect(wage).toBeGreaterThan(expectedWages[index]);
        });
    });
    test('it leaves the morale as it is if no modifiers specified', () => {
        const player = {
            status: {
                morale: 10
            }
        };
        expect(playerHelper.updateStatus(player).status.morale).toBe(10);
    });

    test('it reduce the morale if decrease modifiers specified', () => {
        const player = {
            status: {
                morale: 100
            }
        };
        expect(playerHelper.updateStatus(player, {decreases: [{chance: 100, value: 90}]}).status.morale).toBe(10);
    });

    test('it uplift the morale if increase modifiers specified', () => {
        const player = {
            status: {
                morale: 90
            }
        };
        expect(playerHelper.updateStatus(player, {increases: [{chance: 100, value: 10}]}).status.morale).toBe(100);
    });

    test('it does not uplift the morale if increase modifiers specified and morale already 100', () => {
        const player = {
            status: {
                morale: 100
            }
        };
        expect(playerHelper.updateStatus(player, {increases: [{chance: 100, value: 10}]}).status.morale).toBe(100);
    });

    test('it does not reduce the morale if decrease modifiers specified and morale already 0', () => {
        const player = {
            status: {
                morale: 0
            }
        };
        expect(playerHelper.updateStatus(player, {decreases: [{chance: 100, value: 10}]}).status.morale).toBe(0);
    });

    test('it applies both uplift and decrease', () => {
        const player = {
            status: {
                morale: 80
            }
        };
        expect(playerHelper.updateStatus(
            player,
            {
                increases: [{chance: 100, value: 10}],
                decreases: [{chance: 100, value: 10}]
            })
            .status.morale).toBe(80);
    });
});

describe('teamHelper tests', () => {
    test('it calculates correctly the average skill', () => {
        const roster = range(5).map(_ => {
            return {
                skill: 10
            }
        });
        expect(teamHelper.averageSkill({roster})).toBe(10);
    });

    test('it calculates correctly the average age', () => {
        const roster = range(5).map(_ => {
            return {
                age: 30
            }
        });
        expect(teamHelper.averageAge({roster})).toBe(30);
    });

    test('it updates correctly the average team morale', () => {
        const roster = range(5).map(_ => {
            return {
                status: {
                    morale: 10
                }
            }
        });
        expect(teamHelper.updateStatus({roster}).status.morale).toBe(10);
    });

    test('it gets a list of scorers', () => {
        const team = {
            roster: [
                {
                    position: 'S'
                },
                {
                    position: 'S'
                },
                {
                    position: 'D'
                },
                {
                    position: 'D'
                },
                {
                    position: 'GK'
                },
            ]
        };
        const goals = 3;

        const scorers = teamHelper.scorers(team, goals);
        expect(scorers.length).toBe(goals);
        expect(scorers.filter(p => p === 'GK').length).toBe(0);
    });

    test('Method canPlayModule returns true if team can play its module', () => {
        const team = {
            coach: {
                module: '4-4-2'
            },
            roster: [
                {position: 'S'},
                {position: 'S'},
                {position: 'LM'},
                {position: 'RM'},
                {position: 'CM'},
                {position: 'CM'},
                {position: 'D'},
                {position: 'D'},
                {position: 'LD'},
                {position: 'RD'},
                {position: 'GK'}
            ]
        };

        expect(teamHelper.canPlayModule(team)).toBe(true);
    });

    test('Method canPlayModule returns false if team cant play its module', () => {
        const team = {
            coach: {
                module: '4-4-2'
            },
            roster: [
                {
                    position: 'S'
                },
                {
                    position: 'S'
                },
                {
                    position: 'D'
                },
                {
                    position: 'D'
                },
                {
                    position: 'GK'
                },
            ]
        };

        expect(teamHelper.canPlayModule(team)).toBe(false);
    });

    test('it gets a list of number players per role', () => {
        const team = {
            roster: [
                {
                    position: 'S'
                },
                {
                    position: 'S'
                },
                {
                    position: 'D'
                },
                {
                    position: 'D'
                },
                {
                    position: 'GK'
                },
            ]
        };
        expect(teamHelper.playersPerRole(team)).toEqual({
            GK: 1,
            S: 2,
            D: 2,
            CM: 0,
            LD: 0,
            LM: 0,
            LS: 0,
            RD: 0,
            RM: 0,
            RS: 0
        });
    });
});

describe('leagueHelper tests', () => {
    test('it calculates correctly the new table and scorers given round results', () => {
        const teams = generator.teams(2);
        const fixture = fixtureGenerator.generate(teams);
        const matches = fixture.pop().matches;
        const results = round.simulate(matches, teams);
        const newTable = leagueHelper.parseRoundResults(results, teamHelper.createCleanTable(teams));
        const scorer1 = leagueHelper.parseScorers(results, {});
        Object.keys(newTable).forEach(k => {
            expect(newTable[k]).toEqual({
                name: expect.any(String),
                played: expect.any(Number),
                won: expect.any(Number),
                lost: expect.any(Number),
                draw: expect.any(Number),
                points: expect.any(Number),
                goalsConceded: expect.any(Number),
                goalsScored: expect.any(Number),
            });
        });
        Object.keys(scorer1).forEach(k => {
            expect(scorer1[k]).toEqual({
                goals: expect.any(Number),
                team: expect.any(String),
                player: expect.anything()
            });
        });
        const matches2 = fixture.pop().matches;
        const results2 = round.simulate(matches2, teams);
        const secondRoundTable = leagueHelper.parseRoundResults(results2, newTable);
        Object.keys(secondRoundTable).forEach(k => {
            expect(secondRoundTable[k]).toEqual({
                name: expect.any(String),
                played: expect.any(Number),
                won: expect.any(Number),
                lost: expect.any(Number),
                draw: expect.any(Number),
                points: expect.any(Number),
                goalsConceded: expect.any(Number),
                goalsScored: expect.any(Number),
            });
        });
        const scorer2 = leagueHelper.parseScorers(results2, scorer1);
        Object.keys(scorer2).forEach(k => {
            expect(scorer2[k]).toEqual({
                goals: expect.any(Number),
                team: expect.any(String),
                player: expect.anything()
            });
        });
    });
    test('it update correctly the new status given the result', () => {
        const teams = generator.teams(2);
        const fixture = fixtureGenerator.generate(teams);
        const matches = fixture.pop().matches;
        const results = round.simulate(matches, teams);
        const updatedTeams = leagueHelper.updateStatus(results, teamHelper.teamsToObject(teams));
        expect(updatedTeams.length).toBe(2);
    });
});

describe('filters and sorts', () => {
    test('it filters teams by skill average', () => {
        const generatedTeams = generator.teams(3);
        const teams = generatedTeams.sort(byTeamSkillAvgDesc);
        let previousSkillAvg = 110;
        teams.forEach(t => {
            const currentSkillAvg = teamHelper.averageSkill(t);
            expect(currentSkillAvg).toBeLessThanOrEqual(previousSkillAvg);
            previousSkillAvg = currentSkillAvg;
        });
    });
});