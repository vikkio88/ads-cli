import {teamHelper} from '../helpers'
import {extendedPositions} from '../../config/positions';
// Teams
//ordering functions
export const byTeamSkillAvgDesc = (team, other) => {
    return teamHelper.averageSkill(team) <= teamHelper.averageSkill(other) ? 1 : -1;
};

// Players
//ordering functions
export const byPlayerAbilityToScore = (player, other) => {
    const playerPositionWeight = extendedPositions[player.position].weight;
    const otherPositionWeight = extendedPositions[other.position].weight;
    const playerMorale = player.status.morale;
    const otherMorale = other.status.morale;
    if (playerPositionWeight < otherPositionWeight) {
        return 1;
    }

    if (playerPositionWeight > otherPositionWeight) {
        return -1;
    }
    return playerMorale <= otherMorale ? 1 : -1;
};
export const byPlayerPosition = (player, other) => {
    return extendedPositions[player.position].weight <= extendedPositions[other.position].weight ? -1 : 1;
};