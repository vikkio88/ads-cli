import {error} from "./cli";
import {personPrinter} from "./utils";

export const club = state => {
    const {status, context, entity, action, payload} = state;
    const {currentTeam} = status;
    if (!currentTeam) {
        console.log(error('You are not currently hired in any team'));
        return;
    }
    const team = context.teams.hash[currentTeam];
    switch (entity) {
        case 'coach':
            personPrinter.coach(team.coach);
            break;
        default:
            console.log(error(`wrong command ${entity} ${action}`));
    }
};