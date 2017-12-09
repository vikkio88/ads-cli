import {bold, error} from "./cli";
import {ask, leaguePrinter, teamPrinter} from "./utils";

export const db = state => {
    const {context, entity} = state;
    let {action} = state;
    const {currentTeam} = state.status;
    const options = {};
    if (currentTeam) {
        options.team = currentTeam;
    }
    switch (entity) {
        case 'ts':
        case 'teams':
            teamPrinter.teams(context.teams.list, options);
            break;
        case 't':
        case 'team':
            if (!action) {
                action = ask.selectFromList('Select a Team', context.teams.list, t => bold(t.name))
                action += 1;
            }
            teamPrinter.team(context.teams.list, action);
            break;
        case 'l':
        case 'league':
            const {table, scorers, fixture} = context.league;
            switch (action) {
                case 't':
                case 'table':
                    leaguePrinter.table(table, options);
                    break;
                case 's':
                case 'scorers':
                    leaguePrinter.scorers(scorers, options);
                    break;
                case 'f':
                case 'fixture':
                    leaguePrinter.fixture(fixture, options);
                    break;
                case 'r':
                case 'results':
                    leaguePrinter.results(fixture, options);
                    break;
                default:
                    console.log(error(`invalid action on League ${action}`));
            }

            break;
        case 'market':
            break;
        default:
            console.log(error(`wrong command ${entity} ${action}`));
    }
};