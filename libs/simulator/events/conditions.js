import * as events from "./events";
import {randomizer} from "../../generator";

export default {
    noMoreGamesToPlay(state) {
        const {fixture} = state.context.league;
        if (fixture.length && fixture.filter(r => !r.played).length === 0) {
            return events.seasonOver;
        }
    },
    playersTeamHasPlayed(state) {
        const {status} = state;
        const {playerTeamMatch} = status.tempEvents;
        if (status.hired && playerTeamMatch) {
            if (!playerTeamMatch.isDraw && playerTeamMatch.winner === status.currentTeam) {
                return events.playersTeamWon;
            } else if (!playerTeamMatch.isDraw && playerTeamMatch.loser === status.currentTeam) {
                return events.playersTeamLost;
            }
        }
    },
    playersJobStabilityIsLow(state) {
        const {stability, hired} = state.status;
        if (hired && stability < 10 && randomizer.chance(30)) {
            return events.sackPlayer;
        }
    },
    unemployed(state) {
        const {hired} = state.status;
        if (!hired) {
            return events.offerContract;
        }
    },
    marketIsOpen(state) {
        const {hired, marketOpen} = state.status;
        if (hired && marketOpen && randomizer.chance(30)) {
            return events.transferOffer;
        }
    }
}