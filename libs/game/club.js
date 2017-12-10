import {bold, error} from "./cli";
import {ask, personPrinter, teamPrinter} from "./utils";
import {extendedPositions} from "../../config/positions";
import {tableOrdering} from "../../utils";

const ALLOWED_ORDERING_FIELDS = ['skill', 'age', 'wage', 'value'];

export const club = state => {
    const {status, context, entity, payload} = state;
    let {action} = state;
    const {currentTeam} = status;
    if (!currentTeam) {
        console.log(error('You are not currently hired in any team'));
        return;
    }
    const team = context.teams.hash[currentTeam];
    switch (entity) {
        case 'info':
            teamPrinter.info(team);
            break;
        case 'finance':
            teamPrinter.finance(team);
            break;
        case 'coach':
            personPrinter.coach(team.coach);
            break;
        case 'p':
        case 'player':
            const index = ask.selectFromList(
                'Select a Player',
                team.roster,
                p => `${bold(p.name)} ${bold(p.surname)} - ${extendedPositions[p.position].description}`
            );
            if (index >= 0) {
                personPrinter.player(team.roster[index]);
            }
            break;
        case 'roster':
        case 'players':
            action = action && ALLOWED_ORDERING_FIELDS.indexOf(action) ? tableOrdering(action) : null;
            teamPrinter.myRoster(team.roster, context.league, action);
            break;
        default:
            console.log(error(`wrong command ${entity} ${action}`));
    }
};