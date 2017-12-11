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

    const {hash, list} = context.teams;
    switch (entity) {
        case 'stats':
            action = selectTeam(action, list);
            leaguePrinter.positionTrendChart(hash[list[action - 1].name]);
            break;
        case 'ts':
        case 'teams':
            teamPrinter.teams(context.teams.list, options);
            break;
        case 't':
        case 'team':
            action = selectTeam(action, context.teams.list);
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

const selectTeam = (index, list) => {
    if (!index) {
        index = ask.selectFromList('Select a Team', list, t => bold(t.name));
        index += 1;
    }
    return index;
}