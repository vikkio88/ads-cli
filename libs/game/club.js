import {bold, error} from "./cli";
import {ask, personPrinter, teamPrinter} from "./utils";
import {extendedPositions} from "../../config/positions";

export const club = state => {
    const {status, context, entity, action, payload} = state;
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
        case 'coach':
            personPrinter.coach(team.coach);
            break;
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
        default:
            console.log(error(`wrong command ${entity} ${action}`));
    }
};