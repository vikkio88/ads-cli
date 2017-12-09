import {teamHelper} from '../helpers'
import {extendedPositions} from '../../config/positions';
// Teams
//ordering functions
export const byTeamSkillAvgDesc = (team, other) => {
    return teamHelper.averageSkill(team) <= teamHelper.averageSkill(other) ? 1 : -1;
};

// Players
//ordering functions
export const byPlayerOffensivity = (player, other) => {
    return extendedPositions[player.position].weight <= extendedPositions[other.position].weight ? 1 : -1;
};
export const byPlayerPosition = (player, other) => {
    return extendedPositions[player.position].weight <= extendedPositions[other.position].weight ? -1 : 1;
};