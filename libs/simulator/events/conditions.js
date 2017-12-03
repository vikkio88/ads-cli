import {offerContract, playersTeamLost, playersTeamWon, seasonOver} from "./events";

export default {
    noMoreGamesToPlay(state) {
        const {context} = state;
        if (context.fixture && context.fixture.filter(r => !r.played).length === 0) {
            return seasonOver;
        }
    },
    playersTeamHasPlayed(state) {
        const {status} = state;
        const {playerTeamMatch} = status.tempEvents;
        if (status.hired && playerTeamMatch) {
            if (!playerTeamMatch.isDraw && playerTeamMatch.winner === status.currentTeam) {
                return playersTeamWon;
            } else if (!playerTeamMatch.isDraw && playerTeamMatch.loser === status.currentTeam) {
                return playersTeamLost;

            }
        }
    },
    unemployed(state) {
        const {status} = state;
        if (!status.hired) {
            return offerContract;
        }
    }
}